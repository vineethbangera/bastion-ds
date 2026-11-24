// bastion/no-hardcoded-colors
//
// Fails on colours written by hand instead of read from @vineethbangera/tokens:
//   - hex, rgb(), hsl() and other colour functions in any string
//   - Tailwind arbitrary colours: bg-[#ff0000], text-[rgb(0_0_0)], [color:red]
//   - Tailwind's built-in palette: text-red-500, bg-black/10
//   - colours in inline style objects: style={{ color: "red" }}
//
// Each error names the semantic token to use instead. It picks the token
// whose Light value is nearest the hard-coded colour, choosing only from
// tokens that suit the property (a background gets a surface token, text
// gets a foreground token).
//
// Files inside packages/tokens are exempt: that is where colours live.

import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { join } from "node:path"
import { fileURLToPath } from "node:url"

// Semantic tokens that have a Tailwind utility in packages/ui/src/styles.css.
const SEVERITY = ["severity-critical", "severity-high", "severity-medium", "severity-low", "severity-info"]
const CANDIDATES = {
  surface: ["background", "card", "popover", "primary", "secondary", "muted", "accent", "destructive", ...SEVERITY],
  text: [
    "foreground", "muted-foreground", "card-foreground", "popover-foreground", "primary-foreground",
    "secondary-foreground", "accent-foreground", "destructive", "destructive-foreground", "destructive-text", ...SEVERITY,
  ],
  border: ["border", "input", "ring", "destructive", ...SEVERITY],
}
CANDIDATES.any = [...new Set([...CANDIDATES.surface, ...CANDIDATES.text, ...CANDIDATES.border])]

// Light values from the built tokens, found from the package being linted
// (which depends on @vineethbangera/tokens), or from the sibling package in this
// monorepo. If tokens are not built yet the rule still fails; it just
// suggests tokens by role instead of by nearest value.
const tokenCache = new Map()
function tokenValues(cwd) {
  if (tokenCache.has(cwd)) return tokenCache.get(cwd)
  const candidates = [
    () => createRequire(join(cwd, "package.json")).resolve("@vineethbangera/tokens/tokens.css"),
    () => fileURLToPath(new URL("../../tokens/dist/css/tokens.css", import.meta.url)),
  ]
  let values = {}
  for (const find of candidates) {
    try {
      const css = readFileSync(find(), "utf8")
      const root = css.slice(css.indexOf(":root"), css.indexOf("}"))
      values = Object.fromEntries([...root.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]))
      break
    } catch {
      // try the next location
    }
  }
  tokenCache.set(cwd, values)
  return values
}

// ---------------------------------------------------------------- colours

const NAMED = {
  black: [0, 0, 0], white: [255, 255, 255], red: [255, 0, 0], green: [0, 128, 0], lime: [0, 255, 0],
  blue: [0, 0, 255], yellow: [255, 255, 0], orange: [255, 165, 0], purple: [128, 0, 128],
  pink: [255, 192, 203], gray: [128, 128, 128], grey: [128, 128, 128], silver: [192, 192, 192],
  maroon: [128, 0, 0], navy: [0, 0, 128], teal: [0, 128, 128], aqua: [0, 255, 255], cyan: [0, 255, 255],
  fuchsia: [255, 0, 255], magenta: [255, 0, 255], olive: [128, 128, 0], crimson: [220, 20, 60],
  tomato: [255, 99, 71], gold: [255, 215, 0], darkred: [139, 0, 0], darkgreen: [0, 100, 0],
  lightgray: [211, 211, 211], lightgrey: [211, 211, 211], darkgray: [169, 169, 169], darkgrey: [169, 169, 169],
  whitesmoke: [245, 245, 245], gainsboro: [220, 220, 220], dimgray: [105, 105, 105], slategray: [112, 128, 144],
}
const ALLOWED_KEYWORDS = new Set(["inherit", "initial", "unset", "revert", "currentcolor", "transparent", "none"])

const HEX = /(?<![\w&#/-])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/g
const FUNC = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\([^)]*\)/gi

const isColour = (value) => {
  const v = value.trim().toLowerCase()
  return /^#[0-9a-f]{3,8}$/.test(v) || /^(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/.test(v) || v in NAMED
}

// [r, g, b] for hex, rgb(), hsl() and the named colours above; null otherwise.
function toRgb(value) {
  const v = value.trim().toLowerCase()
  if (v in NAMED) return NAMED[v]
  if (v.startsWith("#")) {
    let h = v.slice(1)
    if (h.length <= 4) h = [...h].map((c) => c + c).join("")
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  }
  const nums = (v.match(/-?[\d.]+%?/g) ?? []).map((n) =>
    n.endsWith("%") ? { pct: true, n: parseFloat(n) } : { pct: false, n: parseFloat(n) }
  )
  if (v.startsWith("rgb") && nums.length >= 3) {
    return nums.slice(0, 3).map(({ pct, n }) => Math.round(pct ? (n * 255) / 100 : n))
  }
  if (v.startsWith("hsl") && nums.length >= 3) {
    const [h, s, l] = [nums[0].n, nums[1].n / 100, nums[2].n / 100]
    const k = (n) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))
    return [f(0), f(8), f(4)].map((c) => Math.round(c * 255))
  }
  return null
}

// Alpha from #rrggbbaa, rgba() or hsla(), as 0-1.
function alphaOf(value) {
  const v = value.trim().toLowerCase()
  if (/^#[0-9a-f]{8}$/.test(v)) return parseInt(v.slice(7), 16) / 255
  if (/^#[0-9a-f]{4}$/.test(v)) return parseInt(v[4] + v[4], 16) / 255
  const m = v.match(/[,/]\s*([\d.]+)(%?)\s*\)$/)
  if (m && /^(?:rgba?|hsla?)\(/.test(v)) return m[2] ? parseFloat(m[1]) / 100 : parseFloat(m[1])
  return 1
}

function nearestToken(tokens, rgb, role) {
  const names = CANDIDATES[role] ?? CANDIDATES.any
  if (!rgb) return null
  let best = null
  for (const name of names) {
    const tokenRgb = tokens[name] && toRgb(tokens[name])
    if (!tokenRgb) continue
    const d = tokenRgb.reduce((sum, c, i) => sum + (c - rgb[i]) ** 2, 0)
    if (!best || d < best.d) best = { name, d }
  }
  return best?.name ?? null
}

// ------------------------------------------------- Tailwind built-in palette

// Tailwind v4 palette colours are oklch, so map families to the closest
// semantic intent rather than computing a distance.
const HUES = {
  red: "destructive", rose: "destructive",
  orange: "severity-high", amber: "severity-medium", yellow: "severity-medium",
  lime: "severity-low", green: "severity-low", emerald: "severity-low",
  teal: "severity-info", cyan: "severity-info", sky: "severity-info", blue: "severity-info", indigo: "severity-info",
}
const GREYS = ["slate", "gray", "zinc", "neutral", "stone", "mauve", "olive", "mist", "taupe"]
const OTHER_HUES = ["violet", "purple", "fuchsia", "pink"]
const PALETTE = [...Object.keys(HUES), ...GREYS, ...OTHER_HUES].join("|")

function paletteToken(colour, role) {
  const [family, shadeText] = colour.split("-")
  if (HUES[family]) return HUES[family]
  const shade = family === "white" ? 0 : family === "black" ? 1000 : Number(shadeText)
  if (!GREYS.includes(family) && family !== "white" && family !== "black") return null
  if (role === "text") return shade >= 700 ? "foreground" : shade <= 100 ? "primary-foreground" : "muted-foreground"
  if (role === "border") return shade <= 300 ? "border" : "ring"
  return shade === 0 ? "background" : shade <= 400 ? "muted" : "primary"
}

// ---------------------------------------------------------- Tailwind classes

const PREFIX = "bg|text|border(?:-[xytrbl]|-[se])?|outline|ring(?:-offset)?|inset-ring|divide|fill|stroke|from|via|to|shadow|inset-shadow|accent|caret|decoration|placeholder"
const PALETTE_CLASS = new RegExp(`^(${PREFIX})-((?:${PALETTE})-(?:50|[1-9]00|950)|black|white)(\\/[\\w.\\[\\]]+)?$`)
const ARBITRARY_CLASS = new RegExp(`^(${PREFIX})-\\[(?:color:)?(.+)\\](\\/[\\w.\\[\\]]+)?$`)
const ARBITRARY_PROPERTY = /^\[((?:background-|border-|outline-|text-decoration-|caret-|accent-)?color|fill|stroke):(.+)\]$/

const roleOfPrefix = (prefix) =>
  /^(bg|from|via|to|fill|accent|shadow|inset-shadow)$/.test(prefix) ? "surface"
    : /^(text|placeholder|caret|decoration|stroke)$/.test(prefix) ? "text"
      : "border"

const roleOfCssProperty = (prop) =>
  /^(background|fill|stop-color|accent)/.test(prop) ? "surface"
    : /^(border|outline|box-shadow|column-rule|ring)/.test(prop) ? "border"
      : "text"

// Strip variants (hover:, dark:, data-[state=open]:) and the ! and - prefixes.
function utilityOf(cls) {
  let depth = 0
  let start = 0
  for (let i = 0; i < cls.length; i++) {
    if (cls[i] === "[") depth++
    else if (cls[i] === "]") depth--
    else if (cls[i] === ":" && depth === 0) start = i + 1
  }
  return cls.slice(start).replace(/^!|!$/g, "").replace(/^-/, "")
}

// ------------------------------------------------------------------ messages

const roleExamples = {
  surface: "--background, --card, --muted or --primary",
  text: "--foreground or --muted-foreground",
  border: "--border, --input or --ring",
  any: "--background, --foreground, --border or --primary",
}

function suggestion(token, role, { prefix, modifier = "", alpha = 1 } = {}) {
  if (!token) return `Use a semantic token instead, such as ${roleExamples[role] ?? roleExamples.any}.`
  const opacity = modifier || (alpha < 1 ? `/${Math.round(alpha * 100)}` : "")
  const usage = prefix ? `${prefix}-${token}${opacity}` : `var(--${token})`
  return `Use the semantic token --${token} instead: ${usage}.`
}

// --------------------------------------------------------------------- rule

const STYLE_COLOUR_PROPS =
  /^(color|background(Color)?|border(Top|Right|Bottom|Left|Block|Inline)?(Start|End)?(Color)?|outline(Color)?|boxShadow|textDecoration(Color)?|caretColor|accentColor|fill|stroke|columnRuleColor)$/
const SKIP_ATTRIBUTES = new Set(["href", "to", "id", "htmlFor", "src", "key"])

export default {
  meta: {
    type: "problem",
    docs: { description: "Disallow hard-coded colours; use Bastion's semantic tokens." },
    schema: [],
    messages: { hardcoded: "Hard-coded colour {{colour}}. {{suggestion}}" },
  },

  create(context) {
    if (/[\\/]packages[\\/]tokens[\\/]/.test(context.filename)) return {}
    const sourceCode = context.sourceCode
    const tokens = tokenValues(context.cwd)

    function report(node, start, end, colour, text) {
      const exact = node.type === "TemplateElement" || node.raw?.length === node.value.length + 2
      context.report({
        node,
        loc: exact
          ? { start: sourceCode.getLocFromIndex(node.range[0] + 1 + start), end: sourceCode.getLocFromIndex(node.range[0] + 1 + end) }
          : node.loc,
        messageId: "hardcoded",
        data: { colour, suggestion: text },
      })
    }

    // Inline style: style={{ color: "red" }}. Returns the CSS-ish property
    // name when this literal is the value of a colour property in a style
    // object on a JSX element.
    function styleProperty(node) {
      const prop = node.parent
      if (prop?.type !== "Property" || prop.value !== node) return null
      const key = prop.key.type === "Identifier" ? prop.key.name : prop.key.value
      const attr = prop.parent?.parent?.parent
      if (prop.parent.parent.type !== "JSXExpressionContainer" || attr?.type !== "JSXAttribute") return null
      if (attr.name.name !== "style" || !STYLE_COLOUR_PROPS.test(key)) return null
      return key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
    }

    function check(node, text) {
      if (!text) return
      const parent = node.parent
      if (parent?.type === "ImportDeclaration" || parent?.type === "ExportAllDeclaration" || parent?.type === "ExportNamedDeclaration") return
      if (parent?.type === "JSXAttribute" && SKIP_ATTRIBUTES.has(parent.name.name)) return

      const cssProp = node.type === "Literal" ? styleProperty(node) : null
      if (cssProp) {
        const role = roleOfCssProperty(cssProp)
        const words = text.split(/\s+(?![^(]*\))/)
        for (const word of words) {
          const lower = word.toLowerCase()
          if (/^var\(--/.test(lower) || ALLOWED_KEYWORDS.has(lower) || !isColour(word)) continue
          const start = text.indexOf(word)
          report(node, start, start + word.length, `"${word}" in style ${cssProp}`,
            suggestion(nearestToken(tokens, toRgb(word), role), role, { alpha: alphaOf(word) }))
        }
        return
      }

      const claimed = []

      // Tailwind classes.
      for (const m of text.matchAll(/[^\s"'`]+/g)) {
        const cls = m[0]
        const utility = utilityOf(cls)
        let found = null

        const palette = utility.match(PALETTE_CLASS)
        const arbitrary = utility.match(ARBITRARY_CLASS)
        const property = utility.match(ARBITRARY_PROPERTY)

        if (palette) {
          const [, prefix, colour, modifier] = palette
          const role = roleOfPrefix(prefix)
          found = suggestion(paletteToken(colour, role), role, { prefix, modifier })
        } else if (arbitrary && isColour(arbitrary[2].replace(/_/g, " "))) {
          const [, prefix, raw, modifier] = arbitrary
          const value = raw.replace(/_/g, " ")
          const role = roleOfPrefix(prefix)
          found = suggestion(nearestToken(tokens, toRgb(value), role), role, { prefix, modifier, alpha: alphaOf(value) })
        } else if (property && isColour(property[2].replace(/_/g, " "))) {
          const value = property[2].replace(/_/g, " ")
          const role = roleOfCssProperty(property[1])
          found = suggestion(nearestToken(tokens, toRgb(value), role), role, { alpha: alphaOf(value) })
        }

        if (found) {
          claimed.push([m.index, m.index + cls.length])
          report(node, m.index, m.index + cls.length, `in class "${cls}"`, found)
        }
      }

      // Any other hex or colour function in a string.
      for (const re of [HEX, FUNC]) {
        for (const m of text.matchAll(re)) {
          if (claimed.some(([s, e]) => m.index >= s && m.index < e)) continue
          claimed.push([m.index, m.index + m[0].length])
          report(node, m.index, m.index + m[0].length, `"${m[0]}"`,
            suggestion(nearestToken(tokens, toRgb(m[0]), "any"), "any", { alpha: alphaOf(m[0]) }))
        }
      }
    }

    return {
      Literal(node) {
        if (typeof node.value === "string") check(node, node.value)
      },
      TemplateElement(node) {
        check(node, node.value.cooked ?? node.value.raw)
      },
    }
  },
}
