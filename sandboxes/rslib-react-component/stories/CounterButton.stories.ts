import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { CounterButton } from '../src/components/CounterButton'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta = {
  title: 'Example/CounterButton',
  component: CounterButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof CounterButton>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    primary: true,
    label: 'CounterButton',
  },
}

// export const Secondary: Story = {
//   args: {
//     label: 'CounterButton',
//   },
// }

// export const Large: Story = {
//   args: {
//     size: 'large',
//     label: 'CounterButton',
//   },
// }

// export const Small: Story = {
//   args: {
//     size: 'small',
//     label: 'CounterButton',
//   },
// }
