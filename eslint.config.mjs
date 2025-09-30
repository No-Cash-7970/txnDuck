import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import testingLibrary from "eslint-plugin-testing-library";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import { includeIgnoreFile } from "@eslint/compat";
import yamlparser from "yaml-eslint-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});
const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

const eslintConfig = defineConfig([
  includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
  globalIgnores(["public/**/*"], "Ignore public directory"),
  ...compat.extends("next/core-web-vitals", "next/typescript"),
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
    files: ["**/*.yaml", "**/*.yml"],
    extends: compat.extends("plugin:yml/standard"),
    languageOptions: {
      parser: yamlparser,
    },
    rules: {
      '@stylistic/max-len': 'off'
    },
  }
]);

export default eslintConfig;
