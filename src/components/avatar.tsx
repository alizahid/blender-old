import initials from 'initials'
import { upperCase } from 'lodash'
import md5 from 'md5'
import React, { FunctionComponent } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import Image from 'react-native-fast-image'

import { colors, layout, typography } from '../styles'

interface Props {
  email?: string
  name?: string
  size?: 'small' | 'large'
  style?: StyleProp<ViewStyle>
}

export const Avatar: FunctionComponent<Props> = ({
  email,
  name,
  size = 'small',
  style
}) => {
  if (name) {
    return (
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
  }

  if (email) {
    return (
      <Image
        source={{
          uri: `https://gravatar.com/avatar/${md5(email)}?s=200`
        }}
        style={[size === 'small' ? styles.small : styles.large, style]}
      />
    )
  }

  return null
}

const styles = StyleSheet.create({
  label: {
    ...typography.code,
    color: colors.background,
    fontSize: typography.tiny.fontSize,
    textAlign: 'center'
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
