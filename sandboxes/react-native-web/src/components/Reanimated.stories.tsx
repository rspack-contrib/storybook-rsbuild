import type { Meta, StoryObj } from '@storybook/react'
import {
  AnimationShowcase,
  FadeInBox,
  PulsingCircle,
  RotatingSquare,
  SpringButton,
} from './Reanimated'

const meta: Meta<typeof FadeInBox> = {
  title: 'Reanimated/Animations',
  component: FadeInBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const FadeIn: Story = {
  render: () => <FadeInBox />,
}

export const Pulsing: Story = {
  render: () => <PulsingCircle />,
}

export const Spring: Story = {
  render: () => <SpringButton />,
}

export const Rotating: Story = {
  render: () => <RotatingSquare />,
}

export const Showcase: Story = {
  render: () => <AnimationShowcase />,
}
