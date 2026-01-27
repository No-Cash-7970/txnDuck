import { fileURLToPath } from "url";
import testingLibrary from "eslint-plugin-testing-library";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { includeIgnoreFile } from "@eslint/compat";
import * as yamlParser from "yaml-eslint-parser";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

const eslintConfig = defineConfig([
  includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
  globalIgnores(["public/**/*"], "Ignore public directory"),
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    plugins: { '@stylistic': stylistic },
    rules: {
      '@stylistic/semi': 'error',
      '@stylistic/max-len': ["warn", { code: 100 }],
      '@typescript-eslint/no-explicit-any': 'off'
    },
  }, {
    files: [
      "**/__tests__/**/*.[jt]s?(x)",
      "**/?(*.)+(test).[jt]s?(x)",
    ],
    ...testingLibrary.configs['flat/react'],
    rules: {
      "testing-library/no-await-sync-events": ["error", { eventModules: ["fire-event"] }],
      "testing-library/await-async-events": ["error", { eventModule: "userEvent" }],
    }
  }, {
    files: ["**/?(*.)+(spec).[jt]s"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["off", {
        argsIgnorePattern: "(Page)$"
      }],
      "react-hooks/rules-of-hooks": "off",
    }
  }, {
    files: ["*.yaml", "*.yml"],
    languageOptions: {
      parser: yamlParser,
    },
  }, {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
  }
]);

export default eslintConfig;
