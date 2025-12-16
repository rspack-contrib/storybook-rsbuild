import type { Meta, StoryObj } from '@storybook/react'
import { Text } from 'react-native'
import { Button } from './Button'
import { Card } from './Card'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    elevated: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Card Title',
    children: (
      <Text>
        This is the card content. You can put any React Native components here.
      </Text>
    ),
  },
}

export const Elevated: Story = {
  args: {
    title: 'Elevated Card',
    elevated: true,
    children: <Text>This card has a shadow effect.</Text>,
  },
}

export const WithButton: Story = {
  args: {
    title: 'Card with Action',
    children: (
      <>
        <Text style={{ marginBottom: 16 }}>
          This card contains an action button.
        </Text>
        <Button label="Take Action" variant="primary" />
      </>
    ),
  },
}

export const NoTitle: Story = {
  args: {
    children: <Text>A card without a title, just content.</Text>,
  },
}
