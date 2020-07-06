import React, { forwardRef } from 'react'
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle
} from 'react-native'

import { colors, layout, typography } from '../styles'

interface Props {
  containerStyle?: StyleProp<ViewStyle>
}

export const TextBox = forwardRef<TextInput, Props & TextInputProps>(
  ({ containerStyle, style, ...props }, ref) =>
    props.multiline ? (
      <View style={[styles.main, containerStyle]}>
        <TextInput
          placeholderTextColor={colors.foregroundLight}
          ref={ref}
          style={[styles.textBox, styles.multiline, style]}
          textAlignVertical="top"
          {...props}
        />
      </View>
    ) : (
      <TextInput
        placeholderTextColor={colors.foregroundLight}
        ref={ref}
        style={[styles.textBox, style]}
        textAlignVertical="top"
        {...props}
      />
    )
)

const styles = StyleSheet.create({
  main: {
    backgroundColor: colors.backgroundDark,
    borderRadius: layout.radius,
    paddingVertical: layout.padding / 2
  },
  multiline: {
    height: layout.textBox * 4,
    lineHeight: typography.regular.fontSize * layout.lineHeight
  },
  textBox: {
    ...typography.regular,
    backgroundColor: colors.backgroundDark,
    borderRadius: layout.radius,
    color: colors.foreground,
    height: layout.textBox,
    paddingHorizontal: layout.margin * (3 / 4)
  }
})
