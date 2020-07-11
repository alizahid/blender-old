import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { RouteProp } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import {
  img_services_environment,
  img_services_events,
  img_services_headers,
  img_services_metrics,
  img_services_redirects,
  img_services_settings,
  img_services_sharing
} from '../assets'
import { TopTabBar } from '../components'
import {
  Bandwidth,
  Environment,
  Events,
  Redirects,
  Sharing
} from '../scenes/services'
import { ServicesParamList } from './services'

export type StaticSiteParamList = {
  Events: {
    id: string
  }
  Environment: {
    id: string
  }
  Redirects: {
    id: string
  }
  Headers: {
    id: string
  }
  Sharing: {
    id: string
  }
  Metrics: {
    id: string
  }
  Settings: {
    id: string
  }
}

const { Navigator, Screen } = createMaterialTopTabNavigator<
  StaticSiteParamList
>()

interface Props {
  route: RouteProp<ServicesParamList, 'Server'>
}

export const StaticSiteNavigator: FunctionComponent<Props> = ({
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
      component={Environment}
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
      component={Redirects}
      initialParams={{
        id
      }}
      name="Redirects"
      options={{
        tabBarIcon: img_services_redirects,
        title: 'Redirects / Rewrites'
      }}
    />
    <Screen
      component={Events}
      initialParams={{
        id
      }}
      name="Headers"
      options={{
        tabBarIcon: img_services_headers,
        title: 'Headers'
      }}
    />
    <Screen
      component={Sharing}
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
      component={Bandwidth}
      initialParams={{
        id
      }}
      name="Metrics"
      options={{
        tabBarIcon: img_services_metrics,
        title: 'Metrics'
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
