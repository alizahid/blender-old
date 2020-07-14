import React, { FunctionComponent } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Image from 'react-native-fast-image'

import { img_ui_dark_checked } from '../../assets'
import { ITeam, IUser } from '../../graphql/types'
import { useAuth } from '../../store'
import { colors, layout, typography } from '../../styles'
import { Avatar } from '../avatar'

interface Props {
  teams: ITeam[]
  user: IUser
}

export const Teams: FunctionComponent<Props> = ({ teams, user }) => {
  const [{ team: teamId }, { changeTeam }] = useAuth()

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Teams</Text>
      <Text style={styles.message}>
        {teams.length === 0
          ? "You're not a member of any teams"
          : 'Tap to switch teams'}
        .
      </Text>
      <Pressable onPress={() => changeTeam(undefined)} style={styles.item}>
        <Avatar name={user.name || user.name} size="large" />
        <Text style={styles.name}>Personal</Text>
        {!teamId && <Image source={img_ui_dark_checked} style={styles.icon} />}
      </Pressable>
      {teams.map((team) => (
        <Pressable
          key={team.id}
          onPress={() => changeTeam(team.id)}
          style={styles.item}>
          <Avatar name={team.name} size="large" />
          <Text style={styles.name}>{team.name}</Text>
          {teamId === team.id && (
            <Image source={img_ui_dark_checked} style={styles.icon} />
          )}
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  icon: {
    height: layout.icon,
    width: layout.icon
  },
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
    flex: 1,
    marginHorizontal: layout.padding
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground
  }
})
