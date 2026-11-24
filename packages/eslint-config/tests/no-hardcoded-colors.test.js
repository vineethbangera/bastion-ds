import { describe, it } from "node:test"
import { RuleTester } from "eslint"

import rule from "../rules/no-hardcoded-colors.js"

RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const tester = new RuleTester({
  languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
})

const error = (pattern) => ({ message: new RegExp(pattern) })

tester.run("no-hardcoded-colors", rule, {
  valid: [
    `<div className="bg-primary text-primary-foreground border-border" />`,
    `<div className="bg-severity-critical/10 dark:bg-destructive/20 hover:text-foreground" />`,
    `<div className="bg-[var(--primary)] text-[14px] border-[2px] w-[calc(100%-2rem)]" />`,
    `<div style={{ color: "var(--foreground)", background: "transparent" }} />`,
    `<div style={{ borderTop: "2px solid var(--border)" }} />`,
    `<a href="#add">Add</a>`,
    `const label = "Red team"`,
    `import x from "#internal"`,
    // Colours are allowed where they are defined.
    { code: `const white = "#ffffff"`, filename: "/repo/packages/tokens/build.mjs" },
  ],
  invalid: [
    { code: `<div className="p-2 bg-[#ff0000]" />`, errors: [error(`"bg-\\[#ff0000\\]".*--destructive.*bg-destructive\\.`)] },
    { code: `<div className="hover:text-[#0a0a0a]" />`, errors: [error(`--foreground.*text-foreground\\.`)] },
    { code: `<div className="bg-[rgba(0,0,0,0.5)]" />`, errors: [error(`bg-primary/50`)] },
    { code: `<div className="[color:red]" />`, errors: [error(`--destructive.*var\\(--destructive\\)`)] },
    { code: `<div className="text-red-500" />`, errors: [error(`--destructive.*text-destructive\\.`)] },
    { code: `<div className="bg-black/10" />`, errors: [error(`bg-primary/10`)] },
    { code: `<div className="border-gray-200" />`, errors: [error(`border-border\\.`)] },
    { code: `<div className="bg-purple-500" />`, errors: [error(`such as --background`)] },
    { code: `<div style={{ color: "red" }} />`, errors: [error(`style color.*var\\(--destructive\\)`)] },
    { code: `<div style={{ backgroundColor: "#fff" }} />`, errors: [error(`var\\(--background\\)`)] },
    { code: `<div style={{ borderTop: "1px solid #e5e5e5" }} />`, errors: [error(`--border`)] },
    { code: `const accent = "hsl(0 0% 9%)"`, errors: [error(`--primary`)] },
    { code: "const css = `color: #737373;`", errors: [error(`--muted-foreground`)] },
  ],
})
