/// <reference types="@repo/dts/common" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LINT_STAGED_TYPE?: "format";
    }
  }
}

export {};
