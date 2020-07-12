import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect } from 'react'

import {
  img_services_builds,
  img_services_environment,
  img_services_events,
  img_services_logs,
  img_services_settings,
  img_services_sharing
} from '../assets'
import { TopTabBar } from '../components'
import { useCronJob } from '../hooks'
import {
  Builds,
  CronJob,
  Environment,
  Events,
  Logs,
  Sharing
} from '../scenes/services'
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
  navigation: StackNavigationProp<ServicesParamList, 'Server'>
  route: RouteProp<ServicesParamList, 'Server'>
}

export const CronJobNavigator: FunctionComponent<Props> = ({
  navigation: { setOptions },
  route: {
    params: { id }
  }
}) => {
  const { cronJob } = useCronJob(id)

  useEffect(() => {
    if (cronJob) {
      setOptions({
        title: cronJob.name
      })
    }
  }, [cronJob, setOptions])

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
        component={CronJob}
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
