import { Pressable, StyleSheet, Text } from 'react-native'

type ButtonProps = {
  label: string
  primary?: boolean
  backgroundColor?: string
  onPress?: () => void
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 160,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d0d7de',
  },
  primary: {
    backgroundColor: '#1ea7fd',
    borderColor: '#1ea7fd',
  },
  secondary: {
    backgroundColor: '#ffffff',
  },
  primaryLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
  secondaryLabel: {
    color: '#24292e',
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.9,
    transform: [{ translateY: 1 }],
  },
})

export const Button = ({
  label,
  primary = true,
  backgroundColor,
  onPress,
}: ButtonProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        primary ? styles.primary : styles.secondary,
        backgroundColor ? { backgroundColor } : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <Text style={primary ? styles.primaryLabel : styles.secondaryLabel}>
        {label}
      </Text>
    </Pressable>
  )
}
