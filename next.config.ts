import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    rules: {
      // 🔕 Completely disable unused variable checks
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",

      // 🔕 Optional: disable unused imports if you're using a plugin like eslint-plugin-unused-imports
      "unused-imports/no-unused-imports": "off",
      "unused-imports/no-unused-vars": "off",
    },
  },
];

export default eslintConfig;
