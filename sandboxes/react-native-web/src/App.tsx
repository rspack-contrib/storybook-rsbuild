import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { NativeButton } from './components/NativeButton'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
})

export function App() {
  return (
    <SafeAreaView>
      <View style={styles.root}>
        <Text style={styles.title}>React Native Web + Storybook</Text>
        <NativeButton label="Primary" />
        <NativeButton label="Secondary" variant="secondary" />
      </View>
    </SafeAreaView>
  )
}
