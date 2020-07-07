import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'

import { img_ui_dark_check } from '../../assets'
import { Header, HeaderButton } from '../../components'
import { Form } from '../../components/env-groups'
import {
  useUpdateEnvGroupEnvVars,
  useUpdateEnvGroupSecretFiles
} from '../../hooks'
import { EnvGroupsParamList } from '../../navigators/env-groups'

interface Props {
  navigation: StackNavigationProp<EnvGroupsParamList, 'EditEnvVar'>
  route: RouteProp<EnvGroupsParamList, 'EditEnvVar'>
}

export const EditEnvVar: FunctionComponent<Props> = ({
  navigation: { setOptions },
  route: {
    params: { envGroup, id }
  }
}) => {
  const { loading, updateEnvVars } = useUpdateEnvGroupEnvVars()
  const {
    loading: updating,
    updateSecretFiles
  } = useUpdateEnvGroupSecretFiles()

  const envVar = envGroup.envVars.find((envVar) => envVar.id === id)

  return (
    <Form
      envVar={envVar}
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
                    onPress={() => {
                      if (data.isFile) {
                        updateSecretFiles(envGroup, data)
                      } else {
                        updateEnvVars(envGroup, data)
                      }
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
