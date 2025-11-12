"use client";

import { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [online, setOnline] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    setMounted(true);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!mounted || online) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 bg-yellow-100 text-yellow-900 px-4 py-2 text-sm shadow">
      <span className="font-semibold">You’re offline.</span>
      <span>Showing cached content if available.</span>
    </div>
  );
}
