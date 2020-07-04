import React, { FunctionComponent, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'

import { Button, TextBox } from '../components'
import { useSignIn } from '../hooks/auth'
import { colors, layout, typography } from '../styles'

export const SignIn: FunctionComponent = () => {
  const { bottom } = useSafeArea()

  const { loading, signIn } = useSignIn()

  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()

  return (
    <View
      style={[
        styles.main,
        {
          marginBottom: bottom
        }
      ]}>
      <Text style={styles.message}>
        Sign in with your Render account. This app does not store any data. We
        don't even have servers. We communicate directly with the Render API.
      </Text>
      <TextBox
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        onChangeText={(email) => setEmail(email)}
        placeholder="Email"
        style={styles.input}
        value={email}
      />
      <TextBox
        onChangeText={(password) => setPassword(password)}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
      />
      <Button
        label="Sign in"
        loading={loading}
        onPress={() => {
          if (email && password) {
            signIn(email, password)
          }
        }}
        style={styles.input}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  input: {
    marginTop: layout.margin
  },
  main: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: layout.margin
  },
  message: {
    ...typography.small,
    color: colors.foregroundLight,
    lineHeight: layout.lineHeight * typography.small.fontSize
  }
})
