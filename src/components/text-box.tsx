import React, { forwardRef } from 'react'
import {
  Dimensions,
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
  ({ containerStyle, style, ...props }, ref) => {
    if (props.multiline) {
      return (
        <View style={[styles.main, containerStyle]}>
          <TextInput
            placeholderTextColor={colors.foregroundLight}
            ref={ref}
            style={[styles.textBox, style, styles.multiline]}
            textAlignVertical="top"
            {...props}
          />
        </View>
      )
    }

    return (
      <TextInput
        placeholderTextColor={colors.foregroundLight}
        ref={ref}
        style={[styles.textBox, style]}
        textAlignVertical="top"
        {...props}
      />
    )
  }
)

const { height } = Dimensions.get('window')

const styles = StyleSheet.create({
  main: {
    backgroundColor: colors.backgroundDark,
    borderRadius: layout.radius,
    paddingVertical: layout.padding
  },
  multiline: {
    ...typography.regular,
    height: height / 4,
    lineHeight: typography.regular.fontSize * layout.lineHeight
  },
  textBox: {
    ...typography.regular,
    backgroundColor: colors.backgroundDark,
    borderRadius: layout.radius,
    color: colors.foreground,
    height: layout.textBox,
    paddingHorizontal: layout.margin
  }
})
