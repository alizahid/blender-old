import React, { FunctionComponent } from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle
} from 'react-native'

import { colors, layout, typography } from '../styles'

interface Props {
  label: string
  loading?: boolean
  small?: boolean
  style?: StyleProp<ViewStyle>
  styleLabel?: TextStyle

  onPress: () => void
}

export const Button: FunctionComponent<Props> = ({
  label,
  loading,
  onPress,
  small,
  style,
  styleLabel
}) => (
  <Pressable
    disabled={loading}
    onPress={onPress}
    style={[styles.main, small && styles.small, style]}>
    {!loading && (
      <Text style={[styles.label, styleLabel, small && styles.smallLabel]}>
        {label}
      </Text>
    )}
    {loading && <ActivityIndicator color={colors.background} size="small" />}
  </Pressable>
)

const styles = StyleSheet.create({
  label: {
    ...typography.regular,
    ...typography.medium,
    color: colors.background
  },
  main: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: layout.radius,
    flexDirection: 'row',
    height: layout.button,
    justifyContent: 'center',
    paddingHorizontal: layout.margin
  },
  small: {
    height: layout.button * 0.75,
    paddingHorizontal: layout.margin * 0.75
  },
  smallLabel: {
    ...typography.small,
    ...typography.medium
  }
})
