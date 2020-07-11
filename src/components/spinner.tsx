import React, { FunctionComponent } from 'react'
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native'

import { colors } from '../styles'

interface Props {
  color?: string
  full?: boolean
  style?: StyleProp<ViewStyle>
}

export const Spinner: FunctionComponent<Props> = ({ color, full, style }) => {
  if (full) {
    return (
      <View style={styles.main}>
        <ActivityIndicator color={color ?? colors.primary} size="large" />
      </View>
    )
  }

  return <ActivityIndicator color={color ?? colors.primary} style={style} />
}

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  }
})
