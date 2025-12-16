import { useEffect } from 'react'
import { Pressable, Text, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

/**
 * A simple fade-in animation component using Reanimated.
 */
export function FadeInBox() {
  const opacity = useSharedValue(0)

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 })
  }, [opacity])

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
    }),
    [opacity],
  )

  return (
    <Animated.View
      testID="reanimated-fade-in"
      style={[
        {
          width: 100,
          height: 100,
          backgroundColor: '#6366f1',
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
        },
        animatedStyle,
      ]}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>Fade In</Text>
    </Animated.View>
  )
}

/**
 * A pulsing animation component using Reanimated.
 */
export function PulsingCircle() {
  const scale = useSharedValue(1)

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withSpring(1.2, { damping: 2 }),
        withSpring(1, { damping: 2 }),
      ),
      -1,
      true,
    )
  }, [scale])

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
    }),
    [scale],
  )

  return (
    <Animated.View
      style={[
        {
          width: 80,
          height: 80,
          backgroundColor: '#ec4899',
          borderRadius: 40,
          alignItems: 'center',
          justifyContent: 'center',
        },
        animatedStyle,
      ]}
    >
      <Text style={{ color: 'white', fontSize: 12 }}>Pulse</Text>
    </Animated.View>
  )
}

/**
 * An interactive spring animation component.
 */
export function SpringButton() {
  const scale = useSharedValue(1)

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 10, stiffness: 400 })
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 400 })
  }

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
    }),
    [scale],
  )

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          {
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: '#10b981',
            borderRadius: 8,
          },
          animatedStyle,
        ]}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Press Me (Spring)
        </Text>
      </Animated.View>
    </Pressable>
  )
}

/**
 * A rotating animation component.
 */
export function RotatingSquare() {
  const rotation = useSharedValue(0)

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1, false)
  }, [rotation])

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ rotate: `${rotation.value}deg` }],
    }),
    [rotation],
  )

  return (
    <Animated.View
      style={[
        {
          width: 60,
          height: 60,
          backgroundColor: '#f59e0b',
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
        },
        animatedStyle,
      ]}
    >
      <Text style={{ color: 'white', fontSize: 10 }}>Spin</Text>
    </Animated.View>
  )
}

/**
 * A showcase of all Reanimated animations.
 */
export function AnimationShowcase() {
  return (
    <View
      testID="reanimated-showcase"
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FadeInBox />
      <PulsingCircle />
      <SpringButton />
      <RotatingSquare />
    </View>
  )
}
