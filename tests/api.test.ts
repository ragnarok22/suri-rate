import { describe, it, expect, vi, beforeEach } from "vitest";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

import { api } from "../utils/index";

beforeEach(() => {
  fetchMock.mockReset();
});

describe("api", () => {
  it("fetches a URL and returns html from the response body", async () => {
    const htmlContent = "<html><body>Hello</body></html>";
    fetchMock.mockResolvedValue(new Response(htmlContent, { status: 200 }));

    const result = await api("https://example.com");
    expect(result.html).toBe(htmlContent);
    expect(fetchMock).toHaveBeenCalledWith("https://example.com", undefined);
  });

  it("returns empty html when response body is null", async () => {
    fetchMock.mockResolvedValue({
      body: null,
      ok: true,
      status: 200,
      headers: new Headers(),
    });

    const result = await api("https://example.com");
    expect(result.html).toBe("");
  });

  it("passes init options to fetch", async () => {
    fetchMock.mockResolvedValue(new Response("ok", { status: 200 }));

    const init = { method: "POST", body: "test" };
    await api("https://example.com/api", init);
    expect(fetchMock).toHaveBeenCalledWith("https://example.com/api", init);
  });

  it("handles multi-chunk streams", async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("chunk1"));
        controller.enqueue(new TextEncoder().encode("chunk2"));
        controller.close();
      },
    });

    fetchMock.mockResolvedValue({
      body: stream,
      ok: true,
      status: 200,
      headers: new Headers(),
    });

    const result = await api("https://example.com");
    expect(result.html).toBe("chunk1chunk2");
  });

  it("handles stream-like object without getReader by returning empty string", async () => {
    fetchMock.mockResolvedValue({
      body: { notAStream: true },
      ok: true,
      status: 200,
      headers: new Headers(),
    });

    const result = await api("https://example.com");
    expect(result.html).toBe("");
  });
});
