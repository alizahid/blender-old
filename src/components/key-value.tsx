import React, { FunctionComponent, useState } from 'react'
import {
  LayoutAnimation,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native'
import Image, { Source } from 'react-native-fast-image'

import { img_ui_dark_invisible, img_ui_dark_visible } from '../assets'
import { colors, layout, typography } from '../styles'
import { Spinner } from './spinner'

interface Action {
  icon: Source

  onPress: () => void
}

interface Props {
  actions?: Action[]
  description?: string
  hidden?: boolean
  label: string
  labelMono?: boolean
  loading?: boolean
  style?: StyleProp<ViewStyle>
  value: string
  valueMono?: boolean
}

export const KeyValue: FunctionComponent<Props> = ({
  actions = [],
  description,
  hidden,
  label,
  labelMono,
  loading,
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
        {!!description && <Text style={styles.description}>{description}</Text>}
      </View>
      {hidden && (
        <Pressable
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)

            setVisible(!visible)
          }}
          style={styles.action}>
          <Image
            source={visible ? img_ui_dark_visible : img_ui_dark_invisible}
            style={styles.icon}
          />
        </Pressable>
      )}
      {loading ? (
        <Spinner style={styles.spinner} />
      ) : (
        actions.map((action, index) => (
          <Pressable
            key={index}
            onPress={() => action.onPress()}
            style={styles.action}>
            <Image source={action.icon} style={styles.icon} />
          </Pressable>
        ))
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  action: {
    justifyContent: 'center',
    marginLeft: layout.padding
  },
  content: {
    flex: 1
  },
  description: {
    ...typography.small,
    color: colors.foregroundLight,
    marginTop: layout.padding
  },
  icon: {
    height: layout.icon,
    marginHorizontal: layout.padding,
    opacity: 0.5,
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
  spinner: {
    marginHorizontal: layout.padding
  },
  value: {
    ...typography.regular,
    marginTop: layout.padding / 2
  }
})
