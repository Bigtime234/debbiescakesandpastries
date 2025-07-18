// eslint.config.js
// eslint.config.js

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // ✅ Base ESLint config for Next.js + TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // ✅ Relaxed rules to avoid build breaks
  {
    files: ["**/*.{js,ts,jsx,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  // ✅ Ignore common folders
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/dist/**"],
  },
];
