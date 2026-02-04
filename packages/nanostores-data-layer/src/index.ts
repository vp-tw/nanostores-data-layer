import type { ReadableAtom, WritableAtom } from "nanostores";
import { atom } from "nanostores";

export type DataLayer<T = unknown> = Array<T>;

const _$dataLayer: WritableAtom<DataLayer> = atom<DataLayer>([]);

function syncToStore(): void {
  if (typeof window !== "undefined" && window.dataLayer) {
    try {
      _$dataLayer.set([...window.dataLayer]);
    } catch (error) {
      console.error("[nanostores-data-layer] Failed to sync dataLayer:", error);
    }
  }
}

// Initialize immediately when module loads
if (typeof window !== "undefined") {
  try {
    window.dataLayer = window.dataLayer || [];
    syncToStore();

    const originalPush = window.dataLayer.push;

    window.dataLayer.push = function (this: DataLayer, ...items: Array<unknown>): number {
      let result: number;
      try {
        result = originalPush.apply(this, items);
      } catch (error) {
        console.error("[nanostores-data-layer] Error in dataLayer.push:", error);
        result = Array.prototype.push.apply(this, items);
      }
      syncToStore();
      return result;
    };
  } catch (error) {
    console.error("[nanostores-data-layer] Failed to initialize:", error);
  }
}

export const $dataLayer: ReadableAtom<DataLayer> = _$dataLayer;
