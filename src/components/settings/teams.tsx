import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { ITeam } from '../../graphql/types'
import { colors, layout, typography } from '../../styles'
import { Avatar } from '../avatar'
import { Touchable } from '../touchable'

interface Props {
  teams: ITeam[]
}

export const Teams: FunctionComponent<Props> = ({ teams }) => (
  <View style={styles.main}>
    <Text style={styles.title}>Teams</Text>
    <Text style={styles.message}>
      {teams.length === 0
        ? "You're not a member of any teams."
        : 'Tap to switch teams.'}
    </Text>
    {teams.map((team) => (
      <Touchable key={team.id} style={styles.item}>
        <Avatar name={team.name} size="large" />
        <Text style={styles.name}>{team.name}</Text>
      </Touchable>
    ))}
  </View>
)

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: layout.margin
  },
  main: {
    padding: layout.margin
  },
  message: {
    ...typography.small,
    color: colors.foregroundLight,
    marginTop: layout.padding
  },
  name: {
    ...typography.regular,
    color: colors.foreground,
    marginLeft: layout.padding
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground
  }
})
