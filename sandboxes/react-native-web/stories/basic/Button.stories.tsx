import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'Basic/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    label: 'Press me',
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    primary: true,
  },
}

export const Secondary: Story = {
  args: {
    primary: false,
    backgroundColor: '#f4f5f7',
  },
}
