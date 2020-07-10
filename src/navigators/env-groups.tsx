import { createStackNavigator } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'

import { Header } from '../components'
import { EnvGroup, EnvGroups } from '../scenes/env-groups'

export type EnvGroupsParamList = {
  EnvGroups: undefined
  EnvGroup: {
    id: string
  }
}

const { Navigator, Screen } = createStackNavigator<EnvGroupsParamList>()

export const EnvGroupsNavigator: FunctionComponent = () => (
  <Navigator>
    <Screen
      component={EnvGroups}
      name="EnvGroups"
      options={{
        header: (props) => <Header {...props} />,
        title: 'Env groups'
      }}
    />
    <Screen
      component={EnvGroup}
      name="EnvGroup"
      options={{
        header: (props) => <Header {...props} />,
        title: 'Env group'
      }}
    />
  </Navigator>
)
