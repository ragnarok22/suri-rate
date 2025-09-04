"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PwaPrompts() {
  const [updateReady, setUpdateReady] = useState(false);
  const [installEvt, setInstallEvt] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const reloading = useRef(false);

  const isInstalled = useMemo(() => {
    if (typeof window === "undefined") return false;
    // iOS Safari
    // @ts-expect-error non-standard
    if (window.navigator.standalone) return true;
    // Other browsers
    return window.matchMedia?.("(display-mode: standalone)").matches ?? false;
  }, []);

  // Listen to next-pwa workbox lifecycle for update prompt
  useEffect(() => {
    const wb: any = (window as any).workbox;
    if (!wb) return;

    const onWaiting = () => setUpdateReady(true);
    const onControlling = () => {
      if (reloading.current) return;
      reloading.current = true;
      window.location.reload();
    };

    wb.addEventListener("waiting", onWaiting);
    wb.addEventListener("externalwaiting", onWaiting);
    wb.addEventListener("controlling", onControlling);

    return () => {
      try {
        wb.removeEventListener("waiting", onWaiting);
        wb.removeEventListener("externalwaiting", onWaiting);
        wb.removeEventListener("controlling", onControlling);
      } catch {}
    };
  }, []);

  // Capture install prompt
  useEffect(() => {
    if (isInstalled) return;
    const onBip = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, [isInstalled]);

  const acceptUpdate = () => {
    const wb: any = (window as any).workbox;
    if (!wb) return;
    // Tell the waiting SW to skip waiting; next-pwa/workbox will take control and we reload on 'controlling'
    wb.messageSW({ type: "SKIP_WAITING" });
  };

  const install = async () => {
    if (!installEvt) return;
    try {
      await installEvt.prompt();
      await installEvt.userChoice;
      setInstallEvt(null);
    } catch {
      // ignore
    }
  };

  return (
    <>
      {updateReady && (
        <div className="fixed inset-x-0 bottom-0 z-50 mx-auto mb-3 w-fit max-w-[95%] rounded-full bg-green-900 px-4 py-2 text-white shadow">
          <div className="flex items-center gap-3">
            <span className="text-sm">Update available</span>
            <button
              onClick={acceptUpdate}
              className="rounded-md bg-white/10 px-3 py-1 text-sm font-semibold hover:bg-white/15"
            >
              Refresh
            </button>
            <button
              onClick={() => setUpdateReady(false)}
              className="rounded-md bg-white/0 px-2 py-1 text-sm hover:bg-white/10"
            >
              Later
            </button>
          </div>
        </div>
      )}

      {installEvt && !isInstalled && (
        <button
          onClick={install}
          className="fixed right-3 bottom-16 z-50 rounded-full bg-green-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-800"
        >
          Install app
        </button>
      )}
    </>
  );
}

