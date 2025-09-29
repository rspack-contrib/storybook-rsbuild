import type { GestureResponderEvent } from 'react-native'
import { Pressable, StyleSheet, Text } from 'react-native'

type Props = {
  label: string
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  onPress?: (event: GestureResponderEvent) => void
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#2563eb',
  },
  primaryText: {
    color: '#f8fafc',
    fontWeight: '600',
    letterSpacing: 0.25,
  },
  secondary: {
    borderWidth: 1,
    borderColor: '#2563eb',
    backgroundColor: 'transparent',
  },
  secondaryText: {
    color: '#1d4ed8',
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.55,
  },
})

export function NativeButton({
  label,
  variant = 'primary',
  disabled = false,
  onPress,
}: Props) {
  const variantStyle = variant === 'primary' ? styles.primary : styles.secondary
  const textStyle =
    variant === 'primary' ? styles.primaryText : styles.secondaryText

  return (
    <Pressable
      accessibilityRole="button"
      style={[styles.button, variantStyle, disabled && styles.disabled]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  )
}
