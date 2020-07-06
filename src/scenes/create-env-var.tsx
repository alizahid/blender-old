import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'

import { img_ui_dark_check } from '../assets'
import { Header, HeaderButton } from '../components'
import { Form } from '../components/env-groups'
import {
  useUpdateEnvGroupEnvVars,
  useUpdateEnvGroupSecretFiles
} from '../hooks'
import { EnvGroupsParamList } from '../navigators/env-groups'

interface Props {
  navigation: StackNavigationProp<EnvGroupsParamList, 'CreateEnvVar'>
  route: RouteProp<EnvGroupsParamList, 'CreateEnvVar'>
}

export const CreateEnvVar: FunctionComponent<Props> = ({
  navigation: { pop, setOptions },
  route: {
    params: { envGroup, isFile }
  }
}) => {
  const { createEnvVar, loading } = useUpdateEnvGroupEnvVars()
  const { createSecretFile, loading: updating } = useUpdateEnvGroupSecretFiles()

  return (
    <Form
      isFile={isFile}
      onUpdate={(data) =>
        setOptions({
          header: (props) => (
            <Header
              {...props}
              loading={loading || updating}
              right={
                data.key && data.value ? (
                  <HeaderButton
                    icon={img_ui_dark_check}
                    onPress={async () => {
                      if (data.isFile) {
                        await createSecretFile(envGroup, data)
                      } else {
                        await createEnvVar(envGroup, data)
                      }

                      pop()
                    }}
                  />
                ) : undefined
              }
            />
          )
        })
      }
    />
  )
}
