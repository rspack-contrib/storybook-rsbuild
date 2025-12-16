import {
  type GestureResponderEvent,
  type StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  type ViewStyle,
} from 'react-native'

export interface ButtonProps {
  /** The button label */
  label: string
  /** Called when the button is pressed */
  onPress?: (event: GestureResponderEvent) => void
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'outline'
  /** Size of the button */
  size?: 'small' | 'medium' | 'large'
  /** Whether the button is disabled */
  disabled?: boolean
  /** Additional styles */
  style?: StyleProp<ViewStyle>
}

/**
 * A basic button component built with React Native primitives.
 * Works on both native and web platforms via react-native-web.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.text,
          styles[`${variant}Text` as keyof typeof styles],
          styles[`${size}Text` as keyof typeof styles],
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#8E8E93',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: 'bold',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: 'white',
  },
  outlineText: {
    color: '#007AFF',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
})
