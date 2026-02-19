"use client";

import { useEffect, useRef, useState } from "react";
import { usePostHog } from "posthog-js/react";

type InstallPlatform = "ios" | "android" | "desktop" | "other" | "unknown";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function PwaPrompts() {
  const posthog = usePostHog();
  const [mounted, setMounted] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const [installEvt, setInstallEvt] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [isMobile, setIsMobile] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [platform, setPlatform] = useState<InstallPlatform>("unknown");
  const [installDismissed, setInstallDismissed] = useState(false);
  const [bannerHeight, setBannerHeight] = useState(0);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const reloading = useRef(false);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is installed
    // iOS Safari
    // @ts-expect-error non-standard
    if (window.navigator.standalone) {
      setIsInstalled(true);
      setMounted(true);
      return;
    }
    // Other browsers
    const installed =
      window.matchMedia?.("(display-mode: standalone)").matches ?? false;
    setIsInstalled(installed);
    setMounted(true);
  }, []);

  // Register service worker and listen for updates
  useEffect(() => {
    if (
      typeof navigator === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    )
      return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        registrationRef.current = registration;

        // If there's already a waiting worker, show update banner
        if (registration.waiting) {
          setUpdateReady(true);
          return;
        }

        // Listen for new service worker installing
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              setUpdateReady(true);
            }
          });
        });
      })
      .catch(() => {
        // SW registration failed silently
      });

    // Reload when the new SW takes control
    const onControllerChange = () => {
      if (reloading.current) return;
      reloading.current = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange,
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("install-banner-dismissed");
    if (stored === "true") {
      setInstallDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 768px)");
    const updateMobile = () => setIsMobile(media.matches);
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", updateMobile);
      updateMobile();
      return () => media.removeEventListener("change", updateMobile);
    }
    media.addListener?.(updateMobile);
    updateMobile();
    return () => media.removeListener?.(updateMobile);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ua = window.navigator.userAgent || "";
    const detected: InstallPlatform = /iPhone|iPad|iPod/i.test(ua)
      ? "ios"
      : /Android/i.test(ua)
        ? "android"
        : /Windows|Macintosh|Linux|CrOS/i.test(ua)
          ? "desktop"
          : "other";
    const isIosDevice = detected === "ios";
    setIsIos(isIosDevice);
    setPlatform(detected);
  }, []);

  const dismissInstall = () => {
    setInstallDismissed(true);
    posthog?.capture("pwa_install_banner_dismiss", {
      platform,
      hadPrompt: Boolean(installEvt),
    });
    if (typeof window === "undefined") return;
    window.localStorage.setItem("install-banner-dismissed", "true");
  };

  const acceptUpdate = () => {
    const waiting = registrationRef.current?.waiting;
    if (!waiting) return;
    waiting.postMessage({ type: "SKIP_WAITING" });
  };

  const install = async () => {
    if (!installEvt) return;
    try {
      await installEvt.prompt();
      const choice = await installEvt.userChoice;
      posthog?.capture("pwa_install_prompt_result", {
        outcome: choice.outcome,
        platform,
      });
      setInstallEvt(null);
    } catch {
      posthog?.capture("pwa_install_prompt_error", {
        platform,
      });
    }
  };

  const handleInstallClick = () => {
    posthog?.capture("pwa_install_banner_click", {
      platform,
      variant: installEvt ? "prompt" : "instructions",
    });
    if (installEvt) {
      void install();
      return;
    }
    if (isIos) {
      window.alert(
        'In Safari, tap the share icon and choose "Add to Home Screen" to install.',
      );
      return;
    }
  };

  const shouldShowInstallBanner =
    mounted &&
    !isInstalled &&
    isMobile &&
    !installDismissed &&
    (installEvt || isIos);

  useEffect(() => {
    if (!shouldShowInstallBanner) {
      setBannerHeight(0);
      return;
    }
    const el = bannerRef.current;
    if (!el) return;
    const updateHeight = () =>
      setBannerHeight(el.getBoundingClientRect().height);
    updateHeight();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(updateHeight);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [shouldShowInstallBanner]);

  if (!mounted) return null;

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

      {shouldShowInstallBanner && (
        <>
          <div
            ref={bannerRef}
            className="fixed inset-x-0 top-0 z-50 bg-green-900 px-4 py-3 text-white shadow-lg"
          >
            <div className="mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Install this app</p>
                <p className="text-xs text-white/80">
                  Add Suri Rate to your home screen for quick access.
                </p>
                {isIos && !installEvt && (
                  <p className="text-[11px] text-white/70">
                    Tap the share icon in Safari and pick &quot;Add to Home
                    Screen.&quot;
                  </p>
                )}
              </div>
              <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
                <button
                  onClick={handleInstallClick}
                  disabled={!installEvt && !isIos}
                  className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold uppercase tracking-wide hover:bg-white/15 disabled:opacity-50"
                >
                  {installEvt ? "Install" : "Add to home"}
                </button>
                <button
                  onClick={dismissInstall}
                  aria-label="Close install banner"
                  className="rounded-full bg-white/0 px-2 py-1 text-xs font-semibold hover:bg-white/10 sm:px-3"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          <div
            className="sm:hidden"
            style={{ height: bannerHeight }}
            aria-hidden="true"
          />
        </>
      )}
    </>
  );
}
