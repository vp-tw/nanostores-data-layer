import "@repo/dts/common.d.ts";

declare global {
  interface Window {
    dataLayer: Array<unknown>;
  }
}

export {};
