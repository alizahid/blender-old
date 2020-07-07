import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { RouteProp } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { TopTabBar } from '../components'
import { Events } from '../scenes/services'
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
        title: 'Events'
      }}
    />
    <Screen
      component={Events}
      initialParams={{
        id
      }}
      name="Environment"
      options={{
        title: 'Environment'
      }}
    />
    <Screen
      component={Events}
      initialParams={{
        id
      }}
      name="Redirects"
      options={{
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
        title: 'Headers'
      }}
    />
    <Screen
      component={Events}
      initialParams={{
        id
      }}
      name="Sharing"
      options={{
        title: 'Sharing'
      }}
    />
    <Screen
      component={Events}
      initialParams={{
        id
      }}
      name="Metrics"
      options={{
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
        title: 'Settings'
      }}
    />
  </Navigator>
)
