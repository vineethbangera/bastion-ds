import noHardcodedColors from "./rules/no-hardcoded-colors.js"

// Bastion's own ESLint plugin. Rules are referenced as bastion/<rule>.
export default {
  meta: { name: "@bastion/eslint-plugin" },
  rules: { "no-hardcoded-colors": noHardcodedColors },
}
