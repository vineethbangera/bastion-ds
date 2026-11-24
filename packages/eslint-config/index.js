// Shared ESLint config for every Bastion package. Use it from a package's
// eslint.config.js:
//
//   import bastion from "@bastion/eslint-config"
//   export default bastion

import js from "@eslint/js"
import { fixupPluginRules } from "@eslint/compat"
import jsxA11y from "eslint-plugin-jsx-a11y"
import reactHooks from "eslint-plugin-react-hooks"
import storybook from "eslint-plugin-storybook"
import globals from "globals"
import tseslint from "typescript-eslint"

import bastion from "./plugin.js"

export default [
  { ignores: ["**/dist/**", "**/storybook-static/**", "**/node_modules/**"] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    linterOptions: { reportUnusedDisableDirectives: "error" },
  },

  // Accessibility of JSX: alt text, labels, valid ARIA, keyboard handlers.
  // "strict" turns every rule into an error. jsx-a11y still declares
  // ESLint 9 as its peer, so fixupPluginRules adapts it to ESLint 10.
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: { "jsx-a11y": fixupPluginRules(jsxA11y) },
    languageOptions: jsxA11y.flatConfigs.strict.languageOptions,
    rules: jsxA11y.flatConfigs.strict.rules,
  },

  reactHooks.configs.flat.recommended,

  ...storybook.configs["flat/recommended"],

  // Colours come from @bastion/tokens. The rule skips packages/tokens itself.
  {
    plugins: { bastion },
    rules: { "bastion/no-hardcoded-colors": "error" },
  },
]
