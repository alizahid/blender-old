import { createStackNavigator } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'

import { Header } from '../components'
import { CreateDatabase, Database, Databases } from '../scenes'

export type DatabasesParamList = {
  Databases: undefined
  Database: {
    id: string
  }
  CreateDatabase: undefined
}

const { Navigator, Screen } = createStackNavigator<DatabasesParamList>()

export const DatabasesNavigator: FunctionComponent = () => (
  <Navigator>
    <Screen
      component={Databases}
      name="Databases"
      options={{
        header: (props) => <Header {...props} />,
        title: 'Databases'
      }}
    />
    <Screen
      component={Database}
      name="Database"
      options={{
        header: (props) => <Header {...props} />,
        title: 'Database'
      }}
    />
    <Screen
      component={CreateDatabase}
      name="CreateDatabase"
      options={{
        header: (props) => <Header {...props} />,
        title: 'Create database'
      }}
    />
  </Navigator>
)
