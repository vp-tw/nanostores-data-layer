import type { ReadableAtom } from "nanostores";
import type { DataLayer } from "./index";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

describe("$dataLayer in browser", () => {
  let $dataLayer: ReadableAtom<DataLayer>;

  beforeAll(async () => {
    // Import once to initialize the push wrapper
    const module = await import("./index");
    $dataLayer = module.$dataLayer;
  });

  beforeEach(() => {
    // Clear the dataLayer without replacing the array
    // This preserves the wrapped push method
    window.dataLayer.length = 0;
  });

  it("should initialize window.dataLayer", () => {
    expect(window.dataLayer).toBeDefined();
    expect(Array.isArray(window.dataLayer)).toBe(true);
  });

  it("should update store when push is called", () => {
    window.dataLayer.push({ event: "test_event" });

    const value = $dataLayer.get();
    expect(value).toContainEqual({ event: "test_event" });
  });

  it("should handle multiple pushes", () => {
    window.dataLayer.push({ event: "event1" });
    window.dataLayer.push({ event: "event2" });
    window.dataLayer.push({ event: "event3" });

    const value = $dataLayer.get();
    expect(value).toContainEqual({ event: "event1" });
    expect(value).toContainEqual({ event: "event2" });
    expect(value).toContainEqual({ event: "event3" });
  });

  it("should handle batch push", () => {
    window.dataLayer.push({ event: "batch1" }, { event: "batch2" });

    const value = $dataLayer.get();
    expect(value).toContainEqual({ event: "batch1" });
    expect(value).toContainEqual({ event: "batch2" });
  });

  it("should notify subscribers on push", () => {
    const values: Array<Array<unknown>> = [];
    const unsubscribe = $dataLayer.subscribe((value) => {
      values.push([...value]);
    });

    window.dataLayer.push({ event: "subscribed_event" });

    expect(values.length).toBeGreaterThan(0);
    const lastValue = values[values.length - 1];
    expect(lastValue).toContainEqual({ event: "subscribed_event" });

    unsubscribe();
  });

  it("should return correct length from push", () => {
    const length = window.dataLayer.push({ event: "length_test" });
    expect(length).toBe(window.dataLayer.length);
  });
});
