import type { Meta, StoryObj } from '@storybook/react'
import { FavoriteIcon } from './FavoriteIcon'

const meta: Meta<typeof FavoriteIcon> = {
  title: 'SVG/FavoriteIcon',
  component: FavoriteIcon,
  tags: ['autodocs'],
  args: {
    size: 80,
    color: '#ef4444',
  },
}

export default meta

type Story = StoryObj<typeof FavoriteIcon>

export const Default: Story = {}
