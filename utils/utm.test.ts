import { describe, it, expect } from "vitest";
import { buildUTMUrl, buildBankUTMParams, buildBankUTMUrl } from "./utm";

describe("UTM Builder Functions", () => {
  describe("buildUTMUrl", () => {
    it("should build URL with all UTM parameters", () => {
      const url = buildUTMUrl("https://example.com", {
        source: "surirate",
        medium: "outbound",
        campaign: "rates",
        content: "test-content",
        term: "test-term",
      });

      expect(url).toBe(
        "https://example.com/?utm_source=surirate&utm_medium=outbound&utm_campaign=rates&utm_content=test-content&utm_term=test-term",
      );
    });

    it("should build URL with partial UTM parameters", () => {
      const url = buildUTMUrl("https://example.com", {
        source: "surirate",
        medium: "outbound",
        campaign: "rates",
      });

      expect(url).toBe(
        "https://example.com/?utm_source=surirate&utm_medium=outbound&utm_campaign=rates",
      );
    });

    it("should preserve existing query parameters", () => {
      const url = buildUTMUrl("https://example.com?foo=bar", {
        source: "surirate",
        medium: "outbound",
      });

      expect(url).toContain("foo=bar");
      expect(url).toContain("utm_source=surirate");
      expect(url).toContain("utm_medium=outbound");
    });

    it("should handle invalid URLs gracefully", () => {
      const invalidUrl = "not-a-valid-url";
      const url = buildUTMUrl(invalidUrl, {
        source: "surirate",
      });

      expect(url).toBe(invalidUrl);
    });

    it("should handle URLs with hash fragments", () => {
      const url = buildUTMUrl("https://example.com#section", {
        source: "surirate",
        medium: "outbound",
      });

      expect(url).toContain("#section");
      expect(url).toContain("utm_source=surirate");
      expect(url).toContain("utm_medium=outbound");
    });
  });

  describe("buildBankUTMParams", () => {
    it("should build bank UTM parameters with default values", () => {
      const params = buildBankUTMParams("Finabank");

      expect(params).toEqual({
        source: "surirate",
        medium: "outbound",
        campaign: "rates",
        content: "finabank-all-en",
      });
    });

    it("should build bank UTM parameters with custom currency", () => {
      const params = buildBankUTMParams("Central Bank", "usd");

      expect(params).toEqual({
        source: "surirate",
        medium: "outbound",
        campaign: "rates",
        content: "central-bank-usd-en",
      });
    });

    it("should build bank UTM parameters with all custom values", () => {
      const params = buildBankUTMParams(
        "De Surinaamsche Bank (DSB)",
        "eur",
        "nl",
      );

      expect(params).toEqual({
        source: "surirate",
        medium: "outbound",
        campaign: "rates",
        content: "de-surinaamsche-bank-(dsb)-eur-nl",
      });
    });

    it("should handle bank names with multiple spaces", () => {
      const params = buildBankUTMParams("Central  Money   Exchange", "usd");

      expect(params.content).toBe("central-money-exchange-usd-en");
    });
  });

  describe("buildBankUTMUrl", () => {
    it("should build complete bank URL with UTM parameters", () => {
      const url = buildBankUTMUrl(
        "https://www.finabanknv.com",
        "Finabank",
        "all",
        "en",
      );

      expect(url).toBe(
        "https://www.finabanknv.com/?utm_source=surirate&utm_medium=outbound&utm_campaign=rates&utm_content=finabank-all-en",
      );
    });

    it("should build bank URL with default currency and lang", () => {
      const url = buildBankUTMUrl("https://www.cbvs.sr", "Central Bank");

      expect(url).toContain("utm_source=surirate");
      expect(url).toContain("utm_medium=outbound");
      expect(url).toContain("utm_campaign=rates");
      expect(url).toContain("utm_content=central-bank-all-en");
    });

    it("should build bank URL with specific currency", () => {
      const url = buildBankUTMUrl(
        "https://www.dsb.sr",
        "De Surinaamsche Bank (DSB)",
        "usd",
      );

      // URL encodes parentheses as %28 and %29
      expect(url).toContain(
        "utm_content=de-surinaamsche-bank-%28dsb%29-usd-en",
      );
    });

    it("should preserve existing query params in bank URL", () => {
      const url = buildBankUTMUrl(
        "https://www.cme.sr?page=rates",
        "Central Money Exchange",
        "eur",
        "en",
      );

      expect(url).toContain("page=rates");
      expect(url).toContain("utm_source=surirate");
      expect(url).toContain("utm_content=central-money-exchange-eur-en");
    });

    it("should handle all real bank names correctly", () => {
      const banks = [
        { name: "Finabank", expected: "finabank-all-en" },
        { name: "Central Bank", expected: "central-bank-all-en" },
        {
          name: "Central Money Exchange",
          expected: "central-money-exchange-all-en",
        },
        { name: "Hakrinbank", expected: "hakrinbank-all-en" },
        {
          name: "De Surinaamsche Bank (DSB)",
          expected: "de-surinaamsche-bank-(dsb)-all-en",
        },
        { name: "Republic Bank", expected: "republic-bank-all-en" },
      ];

      banks.forEach(({ name, expected }) => {
        const params = buildBankUTMParams(name);
        expect(params.content).toBe(expected);
      });
    });
  });
});
