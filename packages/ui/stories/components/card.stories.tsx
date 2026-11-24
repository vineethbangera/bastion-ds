import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../src"

const meta = {
  title: "Components/Card",
  component: Card,
  decorators: [(Story) => <div className="w-80">{Story()}</div>],
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Scan schedule</CardTitle>
        <CardDescription>Runs nightly at 02:00 UTC.</CardDescription>
      </CardHeader>
      <CardContent>12 targets, last run 3 hours ago.</CardContent>
      <CardFooter>
        <Button className="ml-auto">Run now</Button>
      </CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Small: Story = { args: { size: "sm" } }

export const WithAction: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Scan schedule</CardTitle>
        <CardDescription>Runs nightly at 02:00 UTC.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>12 targets, last run 3 hours ago.</CardContent>
    </Card>
  ),
}

export const HeaderOnly: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Open findings</CardTitle>
        <CardDescription>None this week.</CardDescription>
      </CardHeader>
    </Card>
  ),
}

export const ContentOnly: Story = {
  render: (args) => (
    <Card {...args}>
      <CardContent>Agent connected. Last heartbeat 12 seconds ago.</CardContent>
    </Card>
  ),
}
