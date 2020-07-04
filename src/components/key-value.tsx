import React, { FunctionComponent, useState } from 'react'
import {
  LayoutAnimation,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native'

import { colors, layout, typography } from '../styles'
import { Touchable } from './touchable'

interface Props {
  hidden?: boolean
  label: string
  labelMono?: boolean
  value: string
  valueMono?: boolean
  style?: StyleProp<ViewStyle>
}

export const KeyValue: FunctionComponent<Props> = ({
  hidden,
  label,
  labelMono,
  style,
  value,
  valueMono
}) => {
  const [visible, setVisible] = useState(!hidden)

  return (
    <View style={style}>
      <View style={styles.header}>
        <Text style={[styles.label, labelMono && styles.mono]}>{label}</Text>
        {hidden && (
          <Touchable
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)

              setVisible(!visible)
            }}
            style={styles.toggle}>
            <Text style={styles.toggleLabel}>{visible ? 'Hide' : 'Show'}</Text>
          </Touchable>
        )}
      </View>
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
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  label: {
    ...typography.small,
    ...typography.medium
  },
  mono: {
    ...typography.code
  },
  spaced: {
    letterSpacing: 2
  },
  toggle: {
    backgroundColor: colors.backgroundDark,
    borderRadius: layout.radius,
    padding: layout.padding / 2
  },
  toggleLabel: {
    ...typography.small
  },
  value: {
    ...typography.regular,
    marginTop: layout.padding / 2
  }
})
