import { createStackNavigator } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'

import { Header } from '../components'
import { Settings } from '../scenes'

export type SettingsParamList = {
  Settings: undefined
}

const { Navigator, Screen } = createStackNavigator<SettingsParamList>()

export const SettingsNavigator: FunctionComponent = () => (
  <Navigator>
    <Screen
      component={Settings}
      name="Settings"
      options={{
        header: (props) => <Header {...props} />,
        title: 'Settings'
      }}
    />
  </Navigator>
)
