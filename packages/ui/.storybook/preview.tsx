import type { Preview } from "@storybook/react-vite"
import { withThemeByClassName } from "@storybook/addon-themes"

import "./preview.css"

const preview: Preview = {
  tags: ["autodocs"],
  decorators: [
    // Toolbar switch: Dark adds the .dark class that @bastion/tokens targets.
    withThemeByClassName({
      themes: { Light: "", Dark: "dark" },
      defaultTheme: "Light",
    }),
  ],
  parameters: {
    layout: "centered",
    controls: { expanded: true },
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
