/**
 * UTM parameter builder for outbound links
 */

type UTMParams = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
};

/**
 * Builds a URL with UTM parameters
 * @param baseUrl - The base URL to append UTM parameters to
 * @param params - UTM parameters to add
 * @returns URL string with UTM parameters
 */
export function buildUTMUrl(baseUrl: string, params: UTMParams): string {
  try {
    const url = new URL(baseUrl);

    if (params.source) url.searchParams.set("utm_source", params.source);
    if (params.medium) url.searchParams.set("utm_medium", params.medium);
    if (params.campaign) url.searchParams.set("utm_campaign", params.campaign);
    if (params.content) url.searchParams.set("utm_content", params.content);
    if (params.term) url.searchParams.set("utm_term", params.term);

    return url.toString();
  } catch (error) {
    // If URL parsing fails, return original URL
    console.error("Failed to build UTM URL:", error);
    return baseUrl;
  }
}

/**
 * Builds UTM parameters for bank outbound links
 * @param bank - Bank name
 * @param currency - Currency type (usd or eur)
 * @param lang - Language code (en, es, nl)
 * @returns UTM parameters object
 */
export function buildBankUTMParams(
  bank: string,
  currency: string = "all",
  lang: string = "en",
): UTMParams {
  return {
    source: "surirate",
    medium: "outbound",
    campaign: "rates",
    content: `${bank.toLowerCase().replace(/\s+/g, "-")}-${currency}-${lang}`,
  };
}

/**
 * Builds a bank URL with UTM parameters
 * @param baseUrl - Bank website URL
 * @param bank - Bank name
 * @param currency - Currency type (optional)
 * @param lang - Language code (optional)
 * @returns URL with UTM parameters
 */
export function buildBankUTMUrl(
  baseUrl: string,
  bank: string,
  currency?: string,
  lang?: string,
): string {
  const params = buildBankUTMParams(bank, currency, lang);
  return buildUTMUrl(baseUrl, params);
}
