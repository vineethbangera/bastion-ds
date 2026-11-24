import type { Meta, StoryObj } from "@storybook/react-vite"
import { ArrowRightIcon, PlusIcon, Trash2Icon } from "lucide-react"

import { Button } from "../../src"

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Run scan" },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Variants
export const Default: Story = {}
export const Outline: Story = { args: { variant: "outline" } }
export const Secondary: Story = { args: { variant: "secondary" } }
export const Ghost: Story = { args: { variant: "ghost" } }
export const Destructive: Story = {
  args: { variant: "destructive", children: "Delete policy" },
}
export const Link: Story = { args: { variant: "link", children: "View report" } }

// Sizes
export const ExtraSmall: Story = { args: { size: "xs" } }
export const Small: Story = { args: { size: "sm" } }
export const Large: Story = { args: { size: "lg" } }
export const Icon: Story = {
  args: { size: "icon", "aria-label": "Add rule", children: <PlusIcon /> },
}
export const IconExtraSmall: Story = {
  args: { size: "icon-xs", "aria-label": "Add rule", children: <PlusIcon /> },
}
export const IconSmall: Story = {
  args: { size: "icon-sm", "aria-label": "Add rule", children: <PlusIcon /> },
}
export const IconLarge: Story = {
  args: { size: "icon-lg", "aria-label": "Add rule", children: <PlusIcon /> },
}

// States
export const Disabled: Story = { args: { disabled: true } }
export const Invalid: Story = {
  args: { variant: "outline", "aria-invalid": true, children: "Select a target" },
}
export const Focused: Story = {
  play: async ({ canvas }) => {
    canvas.getByRole("button").focus()
  },
}
export const WithIconStart: Story = {
  args: {
    children: (
      <>
        <PlusIcon data-icon="inline-start" />
        Add rule
      </>
    ),
  },
}
export const WithIconEnd: Story = {
  args: {
    variant: "outline",
    children: (
      <>
        Next
        <ArrowRightIcon data-icon="inline-end" />
      </>
    ),
  },
}
export const AsLink: Story = {
  args: { asChild: true, variant: "outline", children: <a href="#report">Open report</a> },
}

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(["default", "outline", "secondary", "ghost", "destructive", "link"] as const).map(
        (variant) => (
          <div key={variant} className="flex items-center gap-2">
            {(["xs", "sm", "default", "lg"] as const).map((size) => (
              <Button key={size} {...args} variant={variant} size={size}>
                {variant === "destructive" && <Trash2Icon data-icon="inline-start" />}
                {variant} {size}
              </Button>
            ))}
            <Button {...args} variant={variant} disabled>
              disabled
            </Button>
          </div>
        )
      )}
    </div>
  ),
}
