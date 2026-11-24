import type { Preview } from "@storybook/react-vite"
import { withThemeByClassName } from "@storybook/addon-themes"

import "./preview.css"

const preview: Preview = {
  tags: ["autodocs"],
  decorators: [
    // Toolbar switch: Dark adds the .dark class that @vineethbangera/tokens targets.
    withThemeByClassName({
      themes: { Light: "", Dark: "dark" },
      // The Vitest run sets this to test every story in both themes.
      defaultTheme: import.meta.env.BASTION_TEST_THEME ?? "Light",
    }),
  ],
  parameters: {
    layout: "centered",
    controls: { expanded: true },
    // Accessibility violations fail the story's test (default is "todo",
    // which only warns). The a11y panel in Storybook shows the same checks.
    a11y: { test: "error" },
    options: {
      storySort: {
        order: [
          "Foundations",
          ["Introduction", "Tokens"],
          "Components",
          ["Button", "Input", "Card", "Dialog", "SeverityBadge", "DataTable"],
          "Patterns",
        ],
      },
    },
  },
}

export default preview
