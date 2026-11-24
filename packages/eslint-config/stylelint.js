// Shared Stylelint config for Bastion CSS. Use it from a package's
// stylelint.config.js:
//
//   export default { extends: ["@bastion/eslint-config/stylelint"] }

const COLOUR_MESSAGE =
  "Colours must come from a token: use var(--token), for example var(--foreground), var(--border) or var(--primary)."

const tokenOnly = ["/^var\\(--[\\w-]+\\)$/", "transparent", "currentcolor", "currentColor", "inherit", "initial", "unset", "none"]

export default {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["**/dist/**", "**/storybook-static/**", "**/node_modules/**"],
  rules: {
    // Tailwind v4 at-rules.
    "at-rule-no-unknown": [
      true,
      { ignoreAtRules: ["theme", "source", "custom-variant", "utility", "variant", "apply", "reference", "plugin", "config"] },
    ],
    "import-notation": "string",
    // Blank lines group related theme variables in styles.css.
    "custom-property-empty-line-before": null,

    // No literal colours anywhere in CSS.
    "color-hex-length": null,
    "color-no-hex": [true, { message: COLOUR_MESSAGE }],
    "color-named": ["never", { message: COLOUR_MESSAGE }],
    "function-disallowed-list": [["rgb", "rgba", "hsl", "hsla", "hwb", "lab", "lch", "oklab", "oklch"], { message: COLOUR_MESSAGE }],

    // Colour properties, and Tailwind's --color-* theme variables, must be a var().
    "declaration-property-value-allowed-list": [
      {
        "/^(color|background-color|border(-(top|right|bottom|left|block|inline)(-(start|end))?)?-color|outline-color|text-decoration-color|caret-color|accent-color|column-rule-color|fill|stroke|stop-color|flood-color|lighting-color)$/":
          tokenOnly,
        "/^--color-/": tokenOnly,
        "/^background$/": ["/var\\(--[\\w-]+\\)/", "none", "transparent", "inherit"],
      },
      { message: COLOUR_MESSAGE },
    ],
  },
}
