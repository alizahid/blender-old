import { StackHeaderProps } from '@react-navigation/stack'
import React, { FunctionComponent, ReactChild } from 'react'
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native'
import Image, { Source } from 'react-native-fast-image'
import { useSafeArea } from 'react-native-safe-area-context'

import { img_ui_dark_back } from '../assets'
import { colors, layout, typography } from '../styles'
import { Spinner } from './spinner'

interface Props {
  loading?: boolean
  right?: ReactChild
}

export const Header: FunctionComponent<Props & StackHeaderProps> = ({
  loading,
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
        <View style={[styles.actions, styles.left]}>
          <HeaderButton icon={img_ui_dark_back} onPress={() => goBack()} />
        </View>
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
      {(loading || right) && (
        <View style={[styles.actions, styles.right]}>
          {loading ? (
            <View style={styles.action}>
              <Spinner />
            </View>
          ) : (
            right
          )}
        </View>
      )}
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
  <Pressable onPress={() => onPress()} style={[styles.action, style]}>
    <Image source={icon} style={styles.icon} />
  </Pressable>
)

const styles = StyleSheet.create({
  action: {
    alignItems: 'center',
    height: layout.header,
    justifyContent: 'center',
    width: layout.header
  },
  actions: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute'
  },
  icon: {
    height: layout.icon,
    width: layout.icon
  },
  left: {
    left: 0
  },
  main: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderBottomColor: colors.backgroundDark,
    borderBottomWidth: layout.border * 2,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  right: {
    right: 0
  },
  title: {
    ...typography.regular,
    ...typography.bold,
    color: colors.foreground
  }
})
