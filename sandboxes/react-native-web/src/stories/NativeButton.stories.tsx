import type { Meta, StoryObj } from '@storybook/react'
import { StyleSheet, View } from 'react-native'
import { NativeButton } from '../components/NativeButton'

const styles = StyleSheet.create({
  preview: {
    gap: 12,
    width: '100%',
    maxWidth: 320,
  },
})

const meta: Meta<typeof NativeButton> = {
  title: 'react-native-web/NativeButton',
  component: NativeButton,
  args: {
    label: 'Tap me',
    variant: 'primary',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: { type: 'inline-radio' },
      options: ['primary', 'secondary'],
    },
  },
  decorators: [
    (Story) => (
      <View style={styles.preview}>
        <Story />
      </View>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
