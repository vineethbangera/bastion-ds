import bastion from "./index.js"

export default [
  ...bastion,
  // The rule's own tests are full of hard-coded colours on purpose.
  { files: ["tests/**"], rules: { "bastion/no-hardcoded-colors": "off" } },
]
