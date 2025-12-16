import type { Meta, StoryObj } from '@storybook/react'
import { Text, View } from 'react-native'

/**
 * Showcase component to demonstrate Nativewind is working.
 * Uses various Tailwind CSS utility classes that would have no effect
 * if Nativewind wasn't properly configured.
 */
function NativewindShowcase() {
  return (
    <View
      testID="nativewind-container"
      className="p-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl max-w-md"
    >
      {/* Header with gradient text simulation */}
      <Text
        testID="nativewind-title"
        className="text-3xl font-extrabold text-white mb-4 text-center"
      >
        Nativewind v4
      </Text>

      {/* Badge */}
      <View className="bg-white/20 rounded-full px-4 py-1 self-center mb-6">
        <Text className="text-white text-sm font-medium">
          Tailwind CSS for React Native
        </Text>
      </View>

      {/* Feature list */}
      <View className="space-y-3 mb-6">
        <View className="flex-row items-center bg-white/10 rounded-xl p-3">
          <View className="w-8 h-8 bg-green-400 rounded-full items-center justify-center mr-3">
            <Text className="text-white font-bold">✓</Text>
          </View>
          <Text className="text-white font-medium">className prop working</Text>
        </View>

        <View className="flex-row items-center bg-white/10 rounded-xl p-3">
          <View className="w-8 h-8 bg-blue-400 rounded-full items-center justify-center mr-3">
            <Text className="text-white font-bold">✓</Text>
          </View>
          <Text className="text-white font-medium">
            Tailwind utilities applied
          </Text>
        </View>

        <View className="flex-row items-center bg-white/10 rounded-xl p-3">
          <View className="w-8 h-8 bg-yellow-400 rounded-full items-center justify-center mr-3">
            <Text className="text-white font-bold">✓</Text>
          </View>
          <Text className="text-white font-medium">
            Colors, spacing, shadows
          </Text>
        </View>
      </View>

      {/* Footer note */}
      <Text className="text-white/70 text-xs text-center">
        If you see styled cards with colors and rounded corners, Nativewind is
        working!
      </Text>
    </View>
  )
}

const meta: Meta<typeof NativewindShowcase> = {
  title: 'Nativewind/Showcase',
  component: NativewindShowcase,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Demonstrates Nativewind v4 (Tailwind CSS for React Native) integration. If styles are visible (purple gradient, rounded corners, shadows), Nativewind is working correctly.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

/**
 * A showcase demonstrating various Nativewind/Tailwind features:
 * - Background gradients and colors
 * - Rounded corners (rounded-3xl, rounded-full)
 * - Shadows (shadow-2xl)
 * - Spacing (p-8, mb-4, space-y-3)
 * - Flexbox layout
 * - Typography (text-3xl, font-extrabold)
 * - Opacity modifiers (bg-white/20)
 */
export const Showcase: Story = {}
