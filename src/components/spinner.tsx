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
  size?: 'small' | 'large'
  style?: StyleProp<ViewStyle>
}

export const Spinner: FunctionComponent<Props> = ({
  color = colors.foreground,
  full,
  size = 'small',
  style
}) => {
  if (full) {
    return (
      <View style={styles.main}>
        <Spinner color={color} size="large" />
      </View>
    )
  }

  return <ActivityIndicator color={color} size={size} style={style} />
}

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  }
})
