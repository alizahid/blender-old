import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { FunctionComponent } from 'react'

import { BottomTabBar } from '../components'
import { DatabasesNavigator } from './databases'
import { EnvGroupsNavigator } from './env-groups'
import { ServicesNavigator } from './services'
import { SettingsNavigator } from './settings'

export type AppParamList = {
  Services: undefined
  Databases: undefined
  EnvGroups: undefined
  Settings: undefined
}

const { Navigator, Screen } = createBottomTabNavigator<AppParamList>()

export const AppNavigator: FunctionComponent = () => (
  <Navigator tabBar={(props) => <BottomTabBar {...props} />}>
    <Screen component={ServicesNavigator} name="Services" />
    <Screen component={DatabasesNavigator} name="Databases" />
    <Screen component={EnvGroupsNavigator} name="EnvGroups" />
    <Screen component={SettingsNavigator} name="Settings" />
  </Navigator>
)
