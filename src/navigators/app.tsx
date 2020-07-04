import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { FunctionComponent } from 'react'

import { TabBar } from '../components'
import { Databases, EnvGroups, Services, Settings } from '../scenes'

export type AppParamList = {
  Services: undefined
  Databases: undefined
  EnvGroups: undefined
  Settings: undefined
}

const { Navigator, Screen } = createBottomTabNavigator<AppParamList>()

export const AppNavigator: FunctionComponent = () => (
  <Navigator tabBar={(props) => <TabBar {...props} />}>
    <Screen component={Services} name="Services" />
    <Screen component={Databases} name="Databases" />
    <Screen component={EnvGroups} name="EnvGroups" />
    <Screen component={Settings} name="Settings" />
  </Navigator>
)
