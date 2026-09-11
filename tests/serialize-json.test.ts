import { describe, it, expect } from "vitest";
import { serializeJsonForHtml } from "@/utils/serialize-json";

describe("serializeJsonForHtml", () => {
  it("roundtrips nested values and property names containing HTML characters", () => {
    const value = {
      "<schema>&": {
        items: [
          { "</ScRiPt>": "<img src=x onerror=alert(1)> & < >" },
          ["<!-- comment -->", { "&name>": "A & B" }],
        ],
      },
    };

    const serialized = serializeJsonForHtml(value);

    expect(serialized).not.toMatch(/[<>&]/);
    expect(JSON.parse(serialized)).toStrictEqual(value);
  });

  it("Unicode-escapes every occurrence of less-than, greater-than and ampersand", () => {
    const value = { text: "<<>>&&<>&" };

    const serialized = serializeJsonForHtml(value);

    expect(serialized).toBe(
      '{"text":"\\u003c\\u003c\\u003e\\u003e\\u0026\\u0026\\u003c\\u003e\\u0026"}',
    );
    expect(JSON.parse(serialized)).toStrictEqual(value);
  });

  it.each([
    "</script><img src=x onerror=alert(1)>",
    "</ScRiPt><script>alert(1)</sCrIpT>",
    "<!--<script> comment </script>-->",
  ])("preserves %s as JSON data without literal HTML sequences", (payload) => {
    const serialized = serializeJsonForHtml({ payload });

    expect(serialized).not.toMatch(/[<>&]/);
    expect(serialized).toContain("\\u003c");
    expect(serialized).toContain("\\u003e");
    expect(JSON.parse(serialized)).toStrictEqual({ payload });
  });

  it("preserves benign Unicode, quotes, backslashes and literal escape sequences", () => {
    const value = {
      text: 'Café 日本語 💱 "quoted" \\path\\file \n\t',
      literalEscapes: "\\u003c \\u003e \\u0026",
    };

    const serialized = serializeJsonForHtml(value);

    expect(serialized).toBe(JSON.stringify(value));
    expect(JSON.parse(serialized)).toStrictEqual(value);
  });

  it("retains standard JSON semantics for structured data", () => {
    const value = {
      text: "",
      number: 12.5,
      negativeZero: -0,
      enabled: true,
      disabled: false,
      empty: null,
      omitted: undefined,
      date: new Date("2026-09-11T09:00:00.000Z"),
      values: [undefined, NaN, Infinity, -Infinity, 0, {}, []],
    };

    expect(JSON.parse(serializeJsonForHtml(value))).toStrictEqual({
      text: "",
      number: 12.5,
      negativeZero: 0,
      enabled: true,
      disabled: false,
      empty: null,
      date: "2026-09-11T09:00:00.000Z",
      values: [null, null, null, null, 0, {}, []],
    });
  });
});
