import { createStackNavigator } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'

import { Header } from '../components'
import { Services } from '../scenes/services'
import { CronJobNavigator } from './cron-job'
import { ServerNavigator } from './server'
import { StaticSiteNavigator } from './static-site'

export type ServicesParamList = {
  Services: undefined
  CronJob: {
    id: string
  }
  Server: {
    id: string
  }
  StaticSite: {
    id: string
  }
}

const { Navigator, Screen } = createStackNavigator<ServicesParamList>()

export const ServicesNavigator: FunctionComponent = () => (
  <Navigator>
    <Screen
      component={Services}
      name="Services"
      options={{
        header: (props) => <Header {...props} />,
        title: 'Services'
      }}
    />
    <Screen
      component={ServerNavigator}
      name="Server"
      options={{
        header: (props) => <Header {...props} />,
        title: 'Server'
      }}
    />
    <Screen
      component={CronJobNavigator}
      name="CronJob"
      options={{
        header: (props) => <Header {...props} />,
        title: 'Cron job'
      }}
    />
    <Screen
      component={StaticSiteNavigator}
      name="StaticSite"
      options={{
        header: (props) => <Header {...props} />,
        title: 'Static site'
      }}
    />
  </Navigator>
)
