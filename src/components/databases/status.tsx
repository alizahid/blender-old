import { lowerCase, startCase } from 'lodash'
import React, { FunctionComponent } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'

import { IDatabaseStatus } from '../../graphql/types'
import { colors, layout, typography } from '../../styles'

interface Props {
  status: IDatabaseStatus
  style?: StyleProp<ViewStyle>
}

export const Status: FunctionComponent<Props> = ({ status, style }) => (
  <View style={[styles.main, style]}>
    <View
      style={[
        styles.state,
        {
          backgroundColor:
            status === IDatabaseStatus.Available
              ? colors.status.green
              : status === IDatabaseStatus.Unavailable
              ? colors.status.red
              : colors.status.yellow
        }
      ]}
    />
    <Text style={styles.label}>{startCase(lowerCase(status))}</Text>
  </View>
)

const styles = StyleSheet.create({
  label: {
    ...typography.small,
    color: colors.foregroundLight,
    marginLeft: layout.padding
  },
  main: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  state: {
    borderRadius: layout.icon / 2,
    height: layout.icon / 2,
    width: layout.icon / 2
  }
})
