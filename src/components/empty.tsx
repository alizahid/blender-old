import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { layout, typography } from '../styles'

interface Props {
  message: string
}

export const Empty: FunctionComponent<Props> = ({ message }) => (
  <View style={styles.main}>
    <Text style={styles.message}>{message}</Text>
  </View>
)

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  message: {
    ...typography.regular,
    lineHeight: layout.lineHeight * typography.regular.fontSize,
    margin: layout.margin * 4,
    textAlign: 'center'
  }
})
