import { StackHeaderProps } from '@react-navigation/stack'
import React, { FunctionComponent, ReactChild } from 'react'
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Image, { Source } from 'react-native-fast-image'
import { useSafeArea } from 'react-native-safe-area-context'

import { img_ui_dark_back } from '../assets'
import { colors, layout, typography } from '../styles'
import { Touchable } from './touchable'

interface Props {
  right?: ReactChild
}

export const Header: FunctionComponent<Props & StackHeaderProps> = ({
  navigation: { goBack },
  previous,
  right,
  scene: {
    descriptor: {
      options: { title }
    },
    progress: { current, next }
  }
}) => {
  const { top } = useSafeArea()

  const opacity = Animated.add(current, next ? next : 0).interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0]
  })

  return (
    <Animated.View
      style={[
        styles.main,
        {
          height: layout.header + top,
          opacity,
          paddingTop: top
        }
      ]}>
      {previous && (
        <HeaderButton
          icon={img_ui_dark_back}
          onPress={() => goBack()}
          style={[styles.action, styles.back]}
        />
      )}
      <Animated.Text
        style={[
          styles.title,
          {
            opacity
          }
        ]}>
        {title}
      </Animated.Text>
      {right && <View style={[styles.action, styles.right]}>{right}</View>}
    </Animated.View>
  )
}

interface HeaderButtonProps {
  icon: Source
  style?: StyleProp<ViewStyle>

  onPress: () => void
}

export const HeaderButton: FunctionComponent<HeaderButtonProps> = ({
  icon,
  onPress,
  style
}) => (
  <Touchable onPress={onPress} style={style}>
    <Image source={icon} style={styles.icon} />
  </Touchable>
)

const styles = StyleSheet.create({
  action: {
    alignItems: 'center',
    bottom: 0,
    height: layout.header,
    justifyContent: 'center',
    position: 'absolute',
    width: layout.header
  },
  back: {
    left: 0
  },
  icon: {
    height: layout.icon,
    width: layout.icon
  },
  main: {
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  right: {
    right: 0
  },
  title: {
    ...typography.regular,
    ...typography.bold,
    color: colors.foreground,
    margin: layout.margin
  }
})
