import { createStackNavigator } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'

import { Header } from '../components'
import { IEnvGroup } from '../graphql/types'
import {
  CreateEnvGroup,
  CreateEnvVar,
  EditEnvVar,
  EnvGroup,
  EnvGroups
} from '../scenes'

export type EnvGroupsParamList = {
  EnvGroups: undefined
  EnvGroup: {
    id: string
  }
  CreateEnvGroup: undefined
  EditEnvVar: {
    envGroup: IEnvGroup
    id: string
    isFile: boolean
  }
  CreateEnvVar: {
    envGroup: IEnvGroup
    isFile: boolean
  }
}

const { Navigator, Screen } = createStackNavigator<EnvGroupsParamList>()

export const EnvGroupsNavigator: FunctionComponent = () => (
  <Navigator>
    <Screen
      component={EnvGroups}
      name="EnvGroups"
      options={{
        header: (props) => <Header {...props} />,
        title: 'Env groups'
      }}
    />
    <Screen
      component={EnvGroup}
      name="EnvGroup"
      options={{
        header: (props) => <Header {...props} />,
        title: 'Env group'
      }}
    />
    <Screen
      component={CreateEnvGroup}
      name="CreateEnvGroup"
      options={{
        header: (props) => <Header {...props} />,
        title: 'Create env group'
      }}
    />
    <Screen
      component={CreateEnvVar}
      name="CreateEnvVar"
      options={({ route: { params } }) => ({
        header: (props) => <Header {...props} />,
        title: `Create ${params.isFile ? 'secret file' : 'env var'}`
      })}
    />
    <Screen
      component={EditEnvVar}
      name="EditEnvVar"
      options={({ route: { params } }) => ({
        header: (props) => <Header {...props} />,
        title: `Edit ${params.isFile ? 'secret file' : 'env var'}`
      })}
    />
  </Navigator>
)
