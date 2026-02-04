import { describe, expect, it } from "vitest";
import { $dataLayer } from "./index";

describe("$dataLayer in SSR (Node)", () => {
  it("should export $dataLayer without errors", () => {
    expect($dataLayer).toBeDefined();
  });

  it("should return empty array when window is undefined", () => {
    const value = $dataLayer.get();
    expect(value).toEqual([]);
  });

  it("should have subscribe method", () => {
    expect(typeof $dataLayer.subscribe).toBe("function");
  });

  it("should have listen method", () => {
    expect(typeof $dataLayer.listen).toBe("function");
  });

  it("should have get method", () => {
    expect(typeof $dataLayer.get).toBe("function");
  });

  it("should be typed as ReadableAtom (no set method in type)", () => {
    // ReadableAtom type doesn't expose set method at compile time
    // Runtime still has set (that's expected for nanostores),
    // but TypeScript will error if you try to call $dataLayer.set()
    expect($dataLayer).toBeDefined();
    // @ts-expect-error - $dataLayer is typed as ReadableAtom, so set is not accessible
    const _setExists = typeof $dataLayer.set === "function";
    expect(_setExists).toBe(true); // Runtime: set exists
  });
});
