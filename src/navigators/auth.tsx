import { createStackNavigator } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'

import { Header } from '../components'
import { Landing, SignIn } from '../scenes'

export type AuthParamList = {
  Landing: undefined
  SignIn: undefined
}

const { Navigator, Screen } = createStackNavigator<AuthParamList>()

export const AuthNavigator: FunctionComponent = () => (
  <Navigator>
    <Screen
      component={Landing}
      name="Landing"
      options={{
        headerShown: false
      }}
    />
    <Screen
      component={SignIn}
      name="SignIn"
      options={{
        header: (props) => <Header {...props} />,
        title: 'Sign in'
      }}
    />
  </Navigator>
)
