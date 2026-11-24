import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../src"

const meta = {
  title: "Components/Dialog",
  component: DialogContent,
  args: { showCloseButton: true },
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit schedule</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Edit scan schedule</DialogTitle>
          <DialogDescription>Changes apply from the next run.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save schedule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  // Open the dialog on the story's own page, but not on the Docs page,
  // where several open dialogs would cover everything.
  play: async ({ canvas, userEvent, viewMode }) => {
    if (viewMode === "docs") return
    await userEvent.click(canvas.getByRole("button"))
  },
} satisfies Meta<typeof DialogContent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Closed: Story = { play: undefined }

export const WithoutCloseButton: Story = { args: { showCloseButton: false } }

export const FooterCloseButton: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View agent details</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Agent sentinel-04</DialogTitle>
          <DialogDescription>Version 3.2.1, last seen 12 seconds ago.</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
}
