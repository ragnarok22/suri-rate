"use client";

import { usePostHog } from "posthog-js/react";
import { buildBankUTMUrl } from "@/utils/utm";

interface OutboundLinkProps {
  href: string;
  bankName: string;
  currency?: string;
  lang?: string;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}

/**
 * Client component for tracking outbound links with UTM parameters
 */
export default function OutboundLink({
  href,
  bankName,
  currency = "all",
  lang = "en",
  className,
  children,
  target = "_blank",
  rel = "noopener noreferrer",
}: OutboundLinkProps) {
  const posthog = usePostHog();

  // Build URL with UTM parameters
  const utmUrl = buildBankUTMUrl(href, bankName, currency, lang);

  // Handle outbound click tracking
  const handleClick = () => {
    posthog.capture("outbound_click", {
      bank: bankName,
      url: href,
      utm_url: utmUrl,
      currency,
      lang,
    });
  };

  return (
    <a
      href={utmUrl}
      target={target}
      rel={rel}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
