import type { StorybookConfig } from "@storybook/react-vite"
import remarkGfm from "remark-gfm"

const config: StorybookConfig = {
  framework: "@storybook/react-vite",
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.tsx"],
  addons: [
    {
      name: "@storybook/addon-docs",
      // GitHub-flavoured Markdown, for the tables in the MDX pages.
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
  ],
  typescript: {
    // Reads prop types (including cva variant unions) from the TypeScript
    // checker, so autodocs lists every variant and size.
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // Hide the hundreds of native HTML attributes, keep Bastion's own and
      // the cva variant props.
      propFilter: (prop) =>
        !prop.parent ||
        !prop.parent.fileName.includes("node_modules") ||
        prop.parent.fileName.includes("class-variance-authority"),
    },
  },
  // vite.config.ts builds the library; Storybook builds an app.
  viteFinal: (config) => ({ ...config, build: { ...config.build, lib: false } }),
}

export default config
