import { Theme } from '@react-navigation/native'

import { colors } from './colors'

export { colors } from './colors'
export { layout } from './layout'
export { typography } from './typography'

export const theme: Theme = {
  colors: {
    background: colors.background,
    border: colors.backgroundDark,
    card: colors.backgroundDark,
    primary: colors.primary,
    text: colors.foreground
  },
  dark: false
}
