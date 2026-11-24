// Builds Bastion's semantic colour tokens for every platform from the one
// Tokens Studio export at tokens/tokens.json.
//
// Each mode merges three token sets, lowest layer first:
//   Primitives/Mode 1  raw scales      colors.neutral.900 = #171717
//   Style/Nova         style mapping   color.light.primary = {colors.neutral.900}
//   Theme/<Mode>       semantic names  primary = {color.light.primary}
//
// Stage 1 resolves those references with the Tokens Studio transforms.
// Stage 2 writes only the Theme set's tokens, as plain colours, to CSS,
// TypeScript, SwiftUI and Compose. Resolving first matters for tokens like
// rgba({primary}, {opacity.opacity-80}): if Style Dictionary turned
// {primary} into a SwiftUI Color before filling in the rgba(), the
// output would not compile.

import { readFile, rm, writeFile } from "node:fs/promises"
import StyleDictionary from "style-dictionary"
import { getTransforms, register } from "@tokens-studio/sd-transforms"

const STYLE = "Style/Nova"
const PRIMITIVES = "Primitives/Mode 1"
const MODES = [
  { name: "light", set: "Theme/Light", selector: ":root" },
  { name: "dark", set: "Theme/Dark", selector: ".dark" },
]

const source = JSON.parse(
  await readFile(new URL("../../tokens/tokens.json", import.meta.url), "utf8")
)

register(StyleDictionary)

// Primitives and Style both have a top-level "font" group, so a shallow
// spread would drop one of them.
function merge(target, from) {
  for (const [key, value] of Object.entries(from)) {
    const isGroup = value && typeof value === "object" && !("$value" in value)
    target[key] = isGroup ? merge({ ...target[key] }, value) : value
  }
  return target
}

// Figma groups some tokens under a parent that repeats in the child
// (sidebar.sidebar, chart.chart-1). Drop the parent so the names match
// shadcn's: --sidebar, --chart-1.
function tokenPath(path) {
  return path.filter((part, i) => !path[i + 1]?.startsWith(part))
}

const toCamel = (parts) =>
  parts
    .join("-")
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^[0-9]/, (c) => `_${c}`)

StyleDictionary.registerTransform({
  name: "bastion/name/kebab",
  type: "name",
  transform: (token) => tokenPath(token.path).join("-"),
})

StyleDictionary.registerTransform({
  name: "bastion/name/camel",
  type: "name",
  transform: (token) => toCamel(tokenPath(token.path)),
})

// Figma stores opacity as 0-100; colour functions need 0-1.
StyleDictionary.registerTransform({
  name: "bastion/opacity/fraction",
  type: "value",
  filter: (token) => token.path[0] === "opacity",
  transform: (token) => Number(token.$value ?? token.value) / 100,
})

// Stage 1: the mode's semantic tokens with every reference resolved to a
// CSS colour (#rrggbb, #rrggbbaa or rgba()).
async function resolveMode(mode) {
  const semantic = source[mode.set]
  const sd = new StyleDictionary({
    tokens: [source[PRIMITIVES], source[STYLE], semantic].reduce(merge, {}),
    preprocessors: ["tokens-studio"],
    log: { verbosity: "silent" },
    platforms: {
      resolve: {
        transforms: ["bastion/opacity/fraction", ...getTransforms({ platform: "css" })],
      },
    },
  })
  const resolved = await sd.exportPlatform("resolve")

  const strip = (node) =>
    "$value" in node
      ? { $value: node.$value, $type: node.$type, $description: node.$description }
      : Object.fromEntries(Object.entries(node).map(([k, v]) => [k, strip(v)]))

  return Object.fromEntries(
    Object.keys(semantic).map((key) => [key, strip(resolved[key])])
  )
}

await rm(new URL("./dist", import.meta.url), { recursive: true, force: true })

// Stage 2: one Style Dictionary run per mode, writing every platform.
for (const mode of MODES) {
  const className = `Bastion${mode.name[0].toUpperCase()}${mode.name.slice(1)}`

  const sd = new StyleDictionary({
    tokens: await resolveMode(mode),
    log: { verbosity: "silent" },
    platforms: {
      css: {
        transforms: ["bastion/name/kebab"],
        buildPath: "dist/css/",
        files: [
          {
            destination: `${mode.name}.css`,
            format: "css/variables",
            options: { selector: mode.selector },
          },
        ],
      },
      // Plain JavaScript plus type declarations, so the published package
      // works in any bundler or in Node without compiling TypeScript.
      js: {
        transforms: ["bastion/name/camel"],
        buildPath: "dist/js/",
        files: [
          { destination: `${mode.name}.js`, format: "javascript/es6" },
          { destination: `${mode.name}.d.ts`, format: "typescript/es6-declarations" },
        ],
      },
      ios: {
        transforms: ["color/ColorSwiftUI", "bastion/name/camel"],
        buildPath: "dist/ios/",
        files: [
          {
            destination: `${className}.swift`,
            format: "ios-swift/enum.swift",
            options: { className, import: ["SwiftUI"], accessControl: "public" },
          },
        ],
      },
      android: {
        transforms: ["color/composeColor", "bastion/name/camel"],
        buildPath: "dist/android/",
        files: [
          {
            destination: `${className}Colors.kt`,
            format: "compose/object",
            options: {
              className: `${className}Colors`,
              packageName: "com.bastion.tokens",
              import: ["androidx.compose.ui.graphics.Color"],
            },
          },
        ],
      },
    },
  })

  await sd.buildAllPlatforms()
}

// One stylesheet for the web: Light on :root, Dark on .dark.
const css = await Promise.all(
  MODES.map((mode) =>
    readFile(new URL(`./dist/css/${mode.name}.css`, import.meta.url), "utf8")
  )
)
await writeFile(new URL("./dist/css/tokens.css", import.meta.url), css.join("\n"))

const index = MODES.map((mode) => `export * as ${mode.name} from "./${mode.name}.js"\n`).join("")
await writeFile(new URL("./dist/js/index.js", import.meta.url), index)
await writeFile(new URL("./dist/js/index.d.ts", import.meta.url), index)
