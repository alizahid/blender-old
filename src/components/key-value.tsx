import React, { FunctionComponent, useState } from 'react'
import {
  LayoutAnimation,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native'
import Image, { Source } from 'react-native-fast-image'

import { img_ui_dark_invisible, img_ui_dark_visible } from '../assets'
import { colors, layout, typography } from '../styles'
import { Touchable } from './touchable'

interface Action {
  icon: Source

  onPress: () => void
}

interface Props {
  actions?: Action[]
  hidden?: boolean
  label: string
  labelMono?: boolean
  style?: StyleProp<ViewStyle>
  value: string
  valueMono?: boolean
}

export const KeyValue: FunctionComponent<Props> = ({
  actions = [],
  hidden,
  label,
  labelMono,
  style,
  value,
  valueMono
}) => {
  const [visible, setVisible] = useState(!hidden)

  return (
    <View style={[styles.main, style]}>
      <View style={styles.content}>
        <Text style={[styles.label, labelMono && styles.mono]}>{label}</Text>
        <Text
          selectable={visible}
          style={[
            styles.value,
            valueMono && styles.mono,
            !visible && styles.spaced
          ]}>
          {hidden ? (visible ? value : '●●●●●') : value}
        </Text>
      </View>
      {hidden && (
        <Touchable
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)

            setVisible(!visible)
          }}
          style={styles.action}>
          <Image
            source={visible ? img_ui_dark_visible : img_ui_dark_invisible}
            style={styles.icon}
          />
        </Touchable>
      )}
      {actions.map((action, index) => (
        <Touchable
          key={index}
          onPress={() => action.onPress()}
          style={styles.action}>
          <Image source={action.icon} style={styles.icon} />
        </Touchable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  action: {
    justifyContent: 'center'
  },
  content: {
    flex: 1
  },
  icon: {
    height: layout.icon,
    marginHorizontal: layout.padding,
    opacity: 0.25,
    width: layout.icon
  },
  label: {
    ...typography.small,
    ...typography.medium,
    color: colors.foregroundLight
  },
  main: {
    alignItems: 'stretch',
    flexDirection: 'row'
  },
  mono: {
    ...typography.code
  },
  spaced: {
    letterSpacing: 2
  },
  value: {
    ...typography.regular,
    marginTop: layout.padding / 2
  }
})
