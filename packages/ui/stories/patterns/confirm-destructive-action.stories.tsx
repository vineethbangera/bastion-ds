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

// The confirmation Sentinel uses before any action that cuts off access or
// deletes data: the title asks the question, the description says what
// happens, and the confirm button repeats the verb.
function ConfirmQuarantine({ host }: { host: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Quarantine host</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Quarantine {host}?</DialogTitle>
          <DialogDescription>
            The host loses all network access except to Sentinel until an analyst
            releases it. Active sessions on it end immediately.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive">Quarantine</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const meta = {
  title: "Patterns/Confirm destructive action",
  component: ConfirmQuarantine,
  tags: ["!autodocs"],
  args: { host: "10.0.4.12" },
} satisfies Meta<typeof ConfirmQuarantine>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {}

export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Quarantine host" }))
  },
}
