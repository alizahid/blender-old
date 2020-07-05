import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { IUser } from '../../graphql/types'
import { colors, layout, shadow, typography } from '../../styles'
import { KeyValue } from '../key-value'

interface Props {
  user: IUser
}

export const Profile: FunctionComponent<Props> = ({ user }) => (
  <View style={styles.main}>
    <Text style={styles.title}>Profile</Text>
    {!!user.name && (
      <KeyValue label="Name" style={styles.item} value={user.name} />
    )}
    <KeyValue label="Email" style={styles.item} value={user.email} />
    <KeyValue
      label="GitHub"
      style={styles.item}
      value={user.githubId ? 'Connected' : 'Not connected'}
    />
    <KeyValue
      label="GitLab"
      style={styles.item}
      value={user.gitlabId ? 'Connected' : 'Not connected'}
    />
  </View>
)

const styles = StyleSheet.create({
  item: {
    marginTop: layout.margin
  },
  main: {
    ...shadow,
    backgroundColor: colors.background,
    borderRadius: layout.radius,
    marginHorizontal: layout.margin,
    marginVertical: layout.padding,
    padding: layout.margin
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground
  }
})
