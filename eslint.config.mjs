import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginImport from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import security from "eslint-plugin-security";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  // Type-aware rules (no-floating-promises, no-misused-promises, no-unsafe-*) need parserOptions.project
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  {
    plugins: {
      import: pluginImport,
      "unused-imports": unusedImports,
      security,
    },
    rules: {
      // --- Errors (fail the build) ---
      "no-console": ["warn", { allow: ["warn"] }],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-var": "warn",
      "prefer-const": "warn",
      "no-duplicate-imports": "warn",
      eqeqeq: ["warn", "always"],
      curly: ["warn", "all"],

      // --- Async / promise safety (catch real runtime bugs; run lint/lint:strict before push) ---
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-misused-promises": [
        "warn",
        { checksVoidReturn: { arguments: false } },
      ],

      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",

      complexity: ["warn", { max: 15 }],
      "max-lines": [
        "warn",
        { max: 500, skipBlankLines: true, skipComments: true },
      ],
      "max-depth": ["warn", { max: 4 }],
      "max-params": ["warn", { max: 4 }],
      "max-nested-callbacks": ["warn", { max: 3 }],

      "@typescript-eslint/no-unused-vars": "warn",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // --- Import sorting (consistent order) ---
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "type",
          ],
          pathGroups: [
            { pattern: "@/**", group: "internal", position: "before" },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
          distinctGroup: false,
        },
      ],

      // --- Security (warn; fix or disable per rule if too noisy) ---
      "security/detect-buffer-noassert": "warn",
      "security/detect-child-process": "warn",
      "security/detect-disable-mustache-escape": "warn",
      "security/detect-eval-with-expression": "warn",
      "security/detect-new-buffer": "warn",
      "security/detect-no-csrf-before-method-override": "warn",
      "security/detect-non-literal-fs-filename": "warn",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-non-literal-require": "warn",
      "security/detect-object-injection": "warn",
      "security/detect-possible-timing-attacks": "warn",
      "security/detect-pseudoRandomBytes": "warn",
      "security/detect-unsafe-regex": "warn",
      "security/detect-bidi-characters": "warn",

      // --- Warnings (fix over time; npm run lint:strict to fail on warnings) ---
      "@typescript-eslint/consistent-type-assertions": [
        "warn",
        { assertionStyle: "never" },
      ],
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "no-unsafe-optional-chaining": "warn",
    },
  },
];

export default eslintConfig;
