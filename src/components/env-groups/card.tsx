import moment from 'moment'
import pluralize from 'pluralize'
import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { IEnvGroup } from '../../graphql/types'
import { colors, layout, typography } from '../../styles'
import { Touchable } from '../touchable'

interface Props {
  envGroup: IEnvGroup

  onPress: (id: string) => void
}

export const Card: FunctionComponent<Props> = ({ envGroup, onPress }) => (
  <Touchable onPress={() => onPress(envGroup.id)} style={styles.main}>
    <View style={styles.content}>
      <Text style={styles.name}>{envGroup.name}</Text>
      <Text style={styles.time}>
        Updated {moment(envGroup.updatedAt).fromNow()}
      </Text>
    </View>
    <View style={styles.variables}>
      <Text style={styles.count}>
        {pluralize('var', envGroup.envVars.length, true)}
      </Text>
    </View>
  </Touchable>
)

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  count: {
    ...typography.small,
    color: colors.foregroundLight
  },
  main: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flexDirection: 'row',
    padding: layout.margin
  },
  name: {
    ...typography.regular,
    ...typography.medium,
    color: colors.foreground
  },
  time: {
    ...typography.small,
    color: colors.foregroundLight,
    marginTop: layout.margin
  },
  variables: {
    backgroundColor: colors.backgroundDark,
    borderRadius: layout.radius,
    marginLeft: layout.margin,
    padding: layout.padding / 2
  }
})
