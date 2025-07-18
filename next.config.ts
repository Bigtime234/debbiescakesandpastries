// eslint.config.js

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// If eslint-config-next crashes due to missing parser or version issues, skip extending it
let nextCoreRules = [];
try {
  nextCoreRules = compat.extends("next/core-web-vitals", "next/typescript");
} catch (error) {
  console.warn("⚠️ Failed to load eslint-config-next:", error.message);
  // Safe fallback — continue without it
}

export default [
  ...nextCoreRules,

  {
    rules: {
      // Disable unused vars and imports warnings
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "off",
      "unused-imports/no-unused-vars": "off",
    },
  },
];
