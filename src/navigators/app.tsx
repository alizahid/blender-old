import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { FunctionComponent } from 'react'

import { TabBar } from '../components'
import { EnvGroups, Services } from '../scenes'
import { DatabasesNavigator } from './databases'
import { SettingsNavigator } from './settings'

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
    <Screen component={DatabasesNavigator} name="Databases" />
    <Screen component={EnvGroups} name="EnvGroups" />
    <Screen component={SettingsNavigator} name="Settings" />
  </Navigator>
)
