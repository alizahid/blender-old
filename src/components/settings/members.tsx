import React, { FunctionComponent, useState } from 'react'
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native'
import Image from 'react-native-fast-image'

import { img_ui_dark_remove } from '../../assets'
import { ITeam } from '../../graphql/types'
import { useAuth } from '../../store'
import { colors, layout, typography } from '../../styles'
import { Avatar } from '../avatar'
import { Button } from '../button'
import { Spinner } from '../spinner'
import { TextBox } from '../text-box'

interface Props {
  adding: boolean
  removing: boolean
  team: ITeam

  onAdd: (email: string) => Promise<void>
  onRemove: (id: string) => void
  onRevoke: (email: string) => void
}

export const Members: FunctionComponent<Props> = ({
  adding,
  onAdd,
  onRemove,
  onRevoke,
  removing,
  team
}) => {
  const [{ email: owner }] = useAuth()

  const [email, setEmail] = useState<string>()

  const submit = async () => {
    if (email) {
      await onAdd(email)

      setEmail(undefined)
    }

    Keyboard.dismiss()
  }

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Members</Text>
      {[...team.users, ...team.pendingUsers].map((user) => (
        <View key={user.email} style={styles.item}>
          <Avatar email={user.email} size="large" />
          <Text style={styles.name}>{user.email}</Text>
          {user.__typename === 'PendingUser' && (
            <View style={styles.tag}>
              <Text style={styles.label}>Pending</Text>
            </View>
          )}
          {owner === user.email ? (
            <View style={styles.tag}>
              <Text style={styles.label}>You</Text>
            </View>
          ) : removing ? (
            <Spinner style={styles.spinner} />
          ) : (
            <Pressable
              onPress={() => {
                if (user.__typename === 'PendingUser') {
                  onRevoke(user.email)
                } else if (user.__typename === 'User') {
                  onRemove(user.id)
                }
              }}
              style={styles.remove}>
              <Image source={img_ui_dark_remove} style={styles.icon} />
            </Pressable>
          )}
        </View>
      ))}
      <Text style={styles.message}>
        Adding other Render users as team members allows them to view, modify,
        and delete any services, databases, env groups, or YAML configurations
        owned by the team.
      </Text>
      <View style={styles.invite}>
        <TextBox
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          onChangeText={(email) => setEmail(email)}
          onSubmitEditing={() => submit()}
          placeholder="Email"
          returnKeyType="go"
          style={styles.input}
          value={email}
        />
        <Button
          label="Invite"
          loading={adding}
          onPress={() => submit()}
          style={styles.button}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0
  },
  icon: {
    height: layout.icon,
    margin: layout.padding,
    opacity: 0.5,
    width: layout.icon
  },
  input: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    flex: 1
  },
  invite: {
    flexDirection: 'row'
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: layout.margin
  },
  label: {
    ...typography.small,
    color: colors.foregroundLight
  },
  main: {
    padding: layout.margin
  },
  message: {
    ...typography.small,
    color: colors.foregroundLight,
    lineHeight: layout.lineHeight * typography.small.fontSize,
    marginVertical: layout.margin
  },
  name: {
    ...typography.regular,
    color: colors.foreground,
    marginLeft: layout.padding
  },
  remove: {
    marginLeft: 'auto'
  },
  spinner: {
    marginLeft: 'auto',
    marginRight: layout.padding,
    marginVertical: layout.padding
  },
  tag: {
    backgroundColor: colors.backgroundDark,
    borderRadius: layout.radius,
    marginLeft: layout.margin,
    padding: layout.padding / 2
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground
  }
})
