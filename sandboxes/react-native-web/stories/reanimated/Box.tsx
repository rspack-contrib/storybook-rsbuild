import { Button, StyleSheet, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

const styles = StyleSheet.create({
  box: {
    width: 200,
    height: 200,
    backgroundColor: '#f97316',
    margin: 8,
    borderRadius: 12,
  },
  container: {
    alignItems: 'flex-start',
    gap: 12,
  },
})

export const Box = () => {
  const offset = useSharedValue(0)

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withSpring(offset.value * 220) }],
    }
  })

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, animatedStyles]} />
      <Button
        color="#4338ca"
        onPress={() => {
          offset.value = Math.random()
        }}
        title="Move"
      />
    </View>
  )
}
