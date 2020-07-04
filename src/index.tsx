import { ApolloProvider } from '@apollo/react-hooks'
import { NavigationContainer } from '@react-navigation/native'
import React, { FunctionComponent, useEffect } from 'react'

import { KeyboardView } from './components'
import { client } from './graphql'
import { AppNavigator, AuthNavigator } from './navigators'
import { useAuth } from './store'
import { theme } from './styles'

export const Blender: FunctionComponent = () => {
  const [{ loggedIn }, { init }] = useAuth()

  useEffect(() => {
    init()
  }, [init])

  return (
    <ApolloProvider client={client}>
      <KeyboardView>
        <NavigationContainer theme={theme}>
          {loggedIn ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </KeyboardView>
    </ApolloProvider>
  )
}
