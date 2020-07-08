import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { RouteProp } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { TopTabBar } from '../components'
import { Events, Logs } from '../scenes/services'
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
        title: 'Logs'
      }}
    />
    <Screen
      component={Events}
      initialParams={{
        id
      }}
      name="Builds"
      options={{
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
        title: 'Settings'
      }}
    />
  </Navigator>
)
