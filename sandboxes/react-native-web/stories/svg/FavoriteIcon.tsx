import Svg, { Path } from 'react-native-svg'

type FavoriteIconProps = {
  size?: number
  color?: string
}

export const FavoriteIcon = ({
  size = 96,
  color = '#ef4444',
}: FavoriteIconProps) => {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
      <Path
        d="M12 21s-6.264-3.622-9.193-8.23C1.055 11.98.7 11.068.7 10.122.7 7.887 2.553 6 4.858 6 6.61 6 8.04 6.968 8.73 8.357L12 4.5l3.27 3.858C16.96 6.968 18.39 6 20.142 6 22.447 6 24.3 7.887 24.3 10.122c0 .946-.355 1.858-2.107 2.648C18.264 17.378 12 21 12 21Z"
        fill={color}
        stroke={color}
        strokeWidth={0.6}
      />
    </Svg>
  )
}
