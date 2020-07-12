import { ApolloProvider } from '@apollo/react-hooks'
import { NavigationContainer } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { Dialog, KeyboardView, Spinner } from './components'
import { client } from './graphql'
import { mitter } from './lib'
import { AppNavigator, AuthNavigator } from './navigators'
import { useAuth } from './store'
import { theme } from './styles'

export const Blender: FunctionComponent = () => {
  const [{ loading, loggedIn }, { init, logout }] = useAuth()

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    const handler = () => logout()

    mitter.on('logout', handler)

    return () => {
      mitter.off('logout', handler)
    }
  }, [logout])

  if (loading) {
    return <Spinner full />
  }

  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <KeyboardView>
          <NavigationContainer theme={theme}>
            {loggedIn ? <AppNavigator /> : <AuthNavigator />}
          </NavigationContainer>
        </KeyboardView>
        <Dialog />
      </SafeAreaProvider>
    </ApolloProvider>
  )
}
