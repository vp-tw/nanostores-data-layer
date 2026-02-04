import { vdustr } from "@vp-tw/eslint-config";
import oxfmtConfig from "./.oxfmtrc.json" with { type: "json" };

export default vdustr(
  {},
  {
    ignores: oxfmtConfig.ignorePatterns,
  },
  {
    files: ["**/package.json"],
    rules: {
      // sorted by oxfmt
      "package-json/order-properties": "off",
    },
  },
);
