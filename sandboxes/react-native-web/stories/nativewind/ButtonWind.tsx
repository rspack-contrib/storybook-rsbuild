import { styled } from 'nativewind'
import { Pressable, Text } from 'react-native'

const StyledPressable = styled(Pressable)
const StyledText = styled(Text)

type ButtonWindProps = {
  label?: string
}

export const ButtonWind = ({ label = 'Nativewind' }: ButtonWindProps) => {
  return (
    <StyledPressable className="rounded-xl bg-indigo-600 px-4 py-3 shadow-md active:bg-indigo-700">
      <StyledText className="text-white text-base font-semibold">
        {label}
      </StyledText>
    </StyledPressable>
  )
}
