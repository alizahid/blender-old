import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { RouteProp } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import {
  img_services_builds,
  img_services_environment,
  img_services_events,
  img_services_logs,
  img_services_settings,
  img_services_sharing
} from '../assets'
import { TopTabBar } from '../components'
import { Builds, Events, Logs } from '../scenes/services'
import { ServicesParamList } from './services'

export type CronJobParamList = {
  Events: {
    id: string
  }
  Logs: {
    id: string
  }
  Builds: {
    id: string
  }
  Environment: {
    id: string
  }
  Sharing: {
    id: string
  }
  Settings: {
    id: string
  }
}

const { Navigator, Screen } = createMaterialTopTabNavigator<CronJobParamList>()

interface Props {
  route: RouteProp<ServicesParamList, 'Server'>
}

export const CronJobNavigator: FunctionComponent<Props> = ({
  route: {
    params: { id }
  }
}) => (
  <Navigator tabBar={(props) => <TopTabBar {...props} />}>
    <Screen
      component={Events}
      initialParams={{
        id
      }}
      name="Events"
      options={{
        tabBarIcon: img_services_events,
        title: 'Events'
      }}
    />
    <Screen
      component={Logs}
      initialParams={{
        id
      }}
      name="Logs"
      options={{
        tabBarIcon: img_services_logs,
        title: 'Logs'
      }}
    />
    <Screen
      component={Builds}
      initialParams={{
        id
      }}
      name="Builds"
      options={{
        tabBarIcon: img_services_builds,
        title: 'Builds'
      }}
    />
    <Screen
      component={Events}
      initialParams={{
        id
      }}
      name="Environment"
      options={{
        tabBarIcon: img_services_environment,
        title: 'Environment'
      }}
    />
    <Screen
      component={Events}
      initialParams={{
        id
      }}
      name="Sharing"
      options={{
        tabBarIcon: img_services_sharing,
        title: 'Sharing'
      }}
    />
    <Screen
      component={Events}
      initialParams={{
        id
      }}
      name="Settings"
      options={{
        tabBarIcon: img_services_settings,
        title: 'Settings'
      }}
    />
  </Navigator>
)
