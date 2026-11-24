import type { Meta, StoryObj } from "@storybook/react-vite"

import { Input } from "../../src"

const meta = {
  title: "Components/Input",
  component: Input,
  args: { placeholder: "10.0.0.0/16", "aria-label": "Target range" },
  decorators: [(Story) => <div className="w-72">{Story()}</div>],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithValue: Story = { args: { defaultValue: "10.0.4.0/24" } }
export const Disabled: Story = { args: { disabled: true, defaultValue: "10.0.4.0/24" } }
export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "10.0.4.0/33" },
}
export const Focused: Story = {
  play: async ({ canvas }) => {
    canvas.getByRole("textbox").focus()
  },
}
export const Password: Story = {
  args: { type: "password", placeholder: "API key", "aria-label": "API key" },
}
export const File: Story = {
  args: { type: "file", placeholder: undefined, "aria-label": "Upload scan report" },
}
export const WithLabel: Story = {
  args: { id: "target", "aria-label": undefined },
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="target" className="text-sm font-medium">
        Target range
      </label>
      <Input {...args} />
    </div>
  ),
}
