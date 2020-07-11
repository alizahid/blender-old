import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Image from 'react-native-fast-image'

import { img_type_github, img_type_gitlab } from '../../assets'
import { ITeam, IUser } from '../../graphql/types'
import { colors, layout, typography } from '../../styles'
import { KeyValue } from '../key-value'

interface Props {
  user: ITeam | IUser
}

export const Profile: FunctionComponent<Props> = ({ user }) => (
  <View style={styles.main}>
    <Text style={styles.title}>
      {user.__typename === 'User' ? 'Profile' : 'Team'}
    </Text>
    {!!user.name && (
      <KeyValue label="Name" style={styles.item} value={user.name} />
    )}
    <KeyValue label="Email" style={styles.item} value={user.email} />
    {user.__typename === 'User' && (
      <>
        <View style={styles.account}>
          <Image source={img_type_github} style={styles.icon} />
          <KeyValue
            label="GitHub"
            style={styles.provider}
            value={user.githubId ? 'Connected' : 'Not connected'}
          />
        </View>
        <View style={styles.account}>
          <Image source={img_type_gitlab} style={styles.icon} />
          <KeyValue
            label="GitLab"
            style={styles.provider}
            value={user.gitlabId ? 'Connected' : 'Not connected'}
          />
        </View>
      </>
    )}
  </View>
)

const styles = StyleSheet.create({
  account: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: layout.margin
  },
  icon: {
    height: layout.icon,
    width: layout.icon
  },
  item: {
    marginTop: layout.margin
  },
  main: {
    padding: layout.margin
  },
  provider: {
    flex: 1,
    marginLeft: layout.padding
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground
  }
})
