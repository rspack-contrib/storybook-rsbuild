import type { Meta, StoryObj } from '@storybook/react'
import { StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    borderWidth: 1,
    borderColor: '#bae6fd',
    gap: 8,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
  },
})

const meta = {
  title: 'react-native-web/Environment',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Flags: Story = {
  render: () => (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Environment</Text>
      <Text>{`NODE_ENV = ${(globalThis as any).process?.env?.NODE_ENV ?? 'development'}`}</Text>
      <Text>{`__DEV__ = ${String(__DEV__)}`}</Text>
    </View>
  ),
}
