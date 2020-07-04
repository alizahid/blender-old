import { Theme } from '@react-navigation/native'

import { colors } from './colors'

export { colors, shadow } from './colors'
export { layout } from './layout'
export { typography } from './typography'

export const theme: Theme = {
  colors: {
    background: colors.backgroundDark,
    border: colors.backgroundDarker,
    card: colors.backgroundDarker,
    primary: colors.primary,
    text: colors.foreground
  },
  dark: false
}
