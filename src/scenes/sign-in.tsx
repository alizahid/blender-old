import React, { FunctionComponent, useRef, useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'

import { Button, TextBox } from '../components'
import { useSignIn } from '../hooks'
import { layout } from '../styles'

export const SignIn: FunctionComponent = () => {
  const { bottom } = useSafeArea()

  const { loading, signIn } = useSignIn()

  const [email, setEmail] = useState<string>()
  const [password, setPassword] = useState<string>()

  const passwordRef = useRef<TextInput>(null)

  const submit = () => {
    if (email && password) {
      signIn(email, password)
    }
  }

  return (
    <View
      style={[
        styles.main,
        {
          marginBottom: bottom
        }
      ]}>
      <TextBox
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        onChangeText={(email) => setEmail(email)}
        onSubmitEditing={() => passwordRef.current?.focus()}
        placeholder="Email"
        style={styles.input}
        value={email}
      />
      <TextBox
        onChangeText={(password) => setPassword(password)}
        onSubmitEditing={() => submit()}
        placeholder="Password"
        ref={passwordRef}
        returnKeyType="go"
        secureTextEntry
        style={styles.input}
        value={password}
      />
      <Button
        label="Sign in"
        loading={loading}
        onPress={() => submit()}
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
  }
})
