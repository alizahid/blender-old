import React, { FunctionComponent } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Image from 'react-native-fast-image'

import { img_ui_dark_remove } from '../../../assets'
import { IPendingPermission, IPermission, IUser } from '../../../graphql/types'
import { useAuth } from '../../../store'
import { colors, layout, typography } from '../../../styles'
import { Avatar } from '../../avatar'

interface Props {
  collaborators: IPermission[]
  owner: IUser
  pending: IPendingPermission[]
  removing: boolean

  onRemove: (id: string) => void
}

export const Collaborators: FunctionComponent<Props> = ({
  collaborators,
  onRemove,
  owner,
  pending,
  removing
}) => {
  const [{ user }] = useAuth()

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Collaborators</Text>
      <View style={styles.collaborator}>
        <Avatar email={owner.email} size="small" />
        <Text style={styles.email}>{owner.email}</Text>
        {user === owner.id && (
          <>
            <View style={[styles.status, styles.owner]}>
              <Text style={[styles.statusLabel, styles.ownerLabel]}>Owner</Text>
            </View>
            <View style={styles.status}>
              <Text style={styles.statusLabel}>You</Text>
            </View>
          </>
        )}
      </View>
      {collaborators.map((collaborator, index) => (
        <View key={index} style={styles.collaborator}>
          <Avatar email={owner.email} size="small" />
          <Text style={styles.email}>{collaborator.subject.email}</Text>
          {!removing && (
            <Pressable
              onPress={() => onRemove(collaborator.subject.id)}
              style={styles.remove}>
              <Image source={img_ui_dark_remove} style={styles.icon} />
            </Pressable>
          )}
        </View>
      ))}
      {pending.map((collaborator, index) => (
        <View key={index} style={styles.collaborator}>
          <Avatar email={owner.email} size="small" />
          <Text style={styles.email}>{collaborator.email}</Text>
          <View style={styles.status}>
            <Text style={styles.statusLabel}>Pending</Text>
          </View>
          {!removing && (
            <Pressable
              onPress={() => onRemove(collaborator.email)}
              style={styles.remove}>
              <Image source={img_ui_dark_remove} style={styles.icon} />
            </Pressable>
          )}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  collaborator: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: layout.margin
  },
  email: {
    ...typography.regular,
    color: colors.foreground,
    flex: 1,
    marginHorizontal: layout.padding
  },
  icon: {
    height: layout.icon,
    width: layout.icon
  },
  main: {
    padding: layout.margin
  },
  owner: {
    backgroundColor: colors.primary,
    marginRight: layout.padding
  },
  ownerLabel: {
    color: colors.background
  },
  remove: {
    marginLeft: layout.margin
  },
  status: {
    backgroundColor: colors.border,
    borderRadius: layout.radius,
    padding: layout.padding / 2
  },
  statusLabel: {
    ...typography.small,
    color: colors.foregroundLight
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground
  }
})
