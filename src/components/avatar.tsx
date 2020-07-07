import initials from 'initials'
import { upperCase } from 'lodash'
import React, { FunctionComponent } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'

import { colors, layout, typography } from '../styles'

interface Props {
  name: string
  size?: 'small' | 'large'
  style?: StyleProp<ViewStyle>
}

export const Avatar: FunctionComponent<Props> = ({
  name,
  size = 'small',
  style
}) => (
  <View
    style={[
      styles.main,
      size === 'small' ? styles.small : styles.large,
      {
        backgroundColor: getBackground(name)
      },
      style
    ]}>
    <Text style={[styles.label, size === 'large' && styles.labelLarge]}>
      {upperCase(initials(name).toString())}
    </Text>
  </View>
)

const styles = StyleSheet.create({
  label: {
    ...typography.code,
    color: colors.background,
    fontSize: typography.tiny.fontSize
  },
  labelLarge: {
    fontSize: typography.regular.fontSize
  },
  large: {
    borderRadius: layout.icon * 2,
    height: layout.icon * 2,
    width: layout.icon * 2
  },
  main: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  small: {
    borderRadius: layout.icon,
    height: layout.icon,
    width: layout.icon
  }
})

const getBackground = (name: string): string => {
  const sum = name
    .split('')
    .reduce((total, data, index) => total + name.charCodeAt(index), 0)

  const colors = [
    '#1787fb',
    '#27cd2b',
    '#4bbec6',
    '#764ffb',
    '#a696c5',
    '#d3a88e',
    '#f73f51',
    '#fd7e37'
  ]

  const index = sum % colors.length

  return colors[index]
}
