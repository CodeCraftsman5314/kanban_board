import baseConfig from "@repo/config/eslint";
import tseslint from "typescript-eslint";

export default tseslint.config({ ignores: ["eslint.config.ts"] }, ...baseConfig, {
  languageOptions: {
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
