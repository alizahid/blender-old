import React, { FunctionComponent, useState } from 'react'
import { Keyboard, StyleSheet, Text, View } from 'react-native'

import { colors, layout, typography } from '../../../styles'
import { Button } from '../../button'
import { TextBox } from '../../text-box'

interface Props {
  loading: boolean

  onAdd: (email: string) => Promise<void>
}

export const Invite: FunctionComponent<Props> = ({ loading, onAdd }) => {
  const [email, setEmail] = useState<string>()

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Invite</Text>
      <Text style={styles.message}>
        Sharing a web service with other Render users allows them to view,
        modify, and delete it
      </Text>
      <View style={styles.footer}>
        <TextBox
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(email) => setEmail(email)}
          placeholder="Email"
          style={styles.input}
          value={email}
        />
        <Button
          label="Invite"
          loading={loading}
          onPress={async () => {
            if (email) {
              await onAdd(email)

              setEmail(undefined)

              Keyboard.dismiss()
            }
          }}
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
  footer: {
    flexDirection: 'row',
    marginTop: layout.margin
  },
  input: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    flex: 1
  },
  main: {
    padding: layout.margin
  },
  message: {
    ...typography.small,
    color: colors.foregroundLight,
    lineHeight: layout.lineHeight * typography.small.fontSize,
    marginTop: layout.padding
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground
  }
})
