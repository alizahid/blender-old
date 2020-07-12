import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect } from 'react'

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
import { useServer } from '../hooks'
import {
  Bandwidth,
  Environment,
  Events,
  Headers,
  Redirects,
  Sharing,
  StaticSite
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
  navigation: StackNavigationProp<ServicesParamList, 'Server'>
  route: RouteProp<ServicesParamList, 'Server'>
}

export const StaticSiteNavigator: FunctionComponent<Props> = ({
  navigation: { setOptions },
  route: {
    params: { id }
  }
}) => {
  const { server } = useServer(id)

  useEffect(() => {
    if (server) {
      setOptions({
        title: server.name
      })
    }
  }, [server, setOptions])

  return (
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
        component={Headers}
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
        component={StaticSite}
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
}
