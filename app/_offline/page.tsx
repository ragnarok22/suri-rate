import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline - SuriRate",
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-2">You are offline</h1>
      <p className="text-center text-gray-600">
        Please check your internet connection and try again.
      </p>
    </div>
  );
}
