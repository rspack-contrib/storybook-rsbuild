import type { Meta, StoryObj } from '@storybook/react'
import { ButtonWind } from './ButtonWind'

const meta: Meta<typeof ButtonWind> = {
  title: 'Nativewind/Button',
  component: ButtonWind,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof ButtonWind>

export const Default: Story = {
  args: {
    label: 'Styled with Tailwind',
  },
}
