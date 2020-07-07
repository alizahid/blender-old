import { createStackNavigator } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'

import { Header } from '../components'
import { Services } from '../scenes'

export type ServicesParamList = {
  Services: undefined
  Service: {
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
  </Navigator>
)
