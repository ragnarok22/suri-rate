import { readFileSync } from "node:fs";
import { setImmediate } from "node:timers/promises";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const source = readFileSync(
  new URL("../public/sw.js", import.meta.url),
  "utf8",
);
const currentCaches = [
  "surirate-precache-v1",
  "surirate-navigations-v1",
  "surirate-static-v1",
  "surirate-images-v1",
  "surirate-fonts-v1",
];

type LifecycleListener = (event: {
  waitUntil: (promise: Promise<unknown>) => void;
}) => void;

function setupActivation(names: string[]) {
  const listeners = new Map<string, LifecycleListener>();
  const deleteCache = vi.fn<(name: string) => Promise<boolean>>();
  deleteCache.mockResolvedValue(true);
  const claim = vi.fn().mockResolvedValue(undefined);

  runInNewContext(source, {
    caches: { keys: vi.fn().mockResolvedValue(names), delete: deleteCache },
    self: {
      addEventListener: (type: string, listener: LifecycleListener) =>
        listeners.set(type, listener),
      clients: { claim },
    },
  });

  return {
    deleteCache,
    claim,
    activate() {
      const waitUntil = vi.fn<(promise: Promise<unknown>) => void>();
      listeners.get("activate")!({ waitUntil });
      expect(waitUntil).toHaveBeenCalledOnce();
      return waitUntil.mock.calls[0][0];
    },
  };
}

describe("service worker activation", () => {
  it("deletes only obsolete app caches concurrently and waits before claiming clients", async () => {
    const worker = setupActivation([
      "surirate-static-v0",
      ...currentCaches,
      "other-app-cache",
      "surirate-images-v0",
    ]);
    const firstDeletion = Promise.withResolvers<boolean>();
    const secondDeletion = Promise.withResolvers<boolean>();
    worker.deleteCache
      .mockReturnValueOnce(firstDeletion.promise)
      .mockReturnValueOnce(secondDeletion.promise);

    const completion = worker.activate();
    await setImmediate();
    expect(worker.deleteCache.mock.calls).toEqual([
      ["surirate-static-v0"],
      ["surirate-images-v0"],
    ]);
    expect(worker.claim).not.toHaveBeenCalled();

    firstDeletion.resolve(true);
    await setImmediate();
    expect(worker.claim).not.toHaveBeenCalled();

    secondDeletion.resolve(true);
    await completion;
    expect(worker.claim).toHaveBeenCalledOnce();
  });

  it.each([{ names: [] }, { names: currentCaches }])(
    "claims clients when no caches need deletion: $names",
    async ({ names }) => {
      const worker = setupActivation(names);
      await worker.activate();
      expect(worker.deleteCache).not.toHaveBeenCalled();
      expect(worker.claim).toHaveBeenCalledOnce();
    },
  );

  it("rejects activation without claiming clients when a deletion fails", async () => {
    const worker = setupActivation(["surirate-static-v0"]);
    const error = new Error("Cache deletion failed");
    worker.deleteCache.mockRejectedValueOnce(error);

    await expect(worker.activate()).rejects.toBe(error);
    expect(worker.claim).not.toHaveBeenCalled();
  });
});
