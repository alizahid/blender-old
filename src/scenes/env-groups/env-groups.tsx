import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect } from 'react'

import { img_ui_dark_add } from '../../assets'
import { Header, HeaderButton } from '../../components'
import { List } from '../../components/env-groups'
import { useCreateEnvGroup, useEnvGroups } from '../../hooks'
import { dialog } from '../../lib'
import { EnvGroupsParamList } from '../../navigators/env-groups'

interface Props {
  navigation: StackNavigationProp<EnvGroupsParamList, 'EnvGroups'>
  route: RouteProp<EnvGroupsParamList, 'EnvGroups'>
}

export const EnvGroups: FunctionComponent<Props> = ({
  navigation: { navigate, setOptions }
}) => {
  const { envGroups, loading, refetch } = useEnvGroups()

  const { create, loading: creating } = useCreateEnvGroup()

  useEffect(() => {
    setOptions({
      header: (props) => (
        <Header
          {...props}
          loading={creating}
          right={
            <HeaderButton
              icon={img_ui_dark_add}
              onPress={async () => {
                const name = await dialog.prompt({
                  message: 'Enter a name for this new env group',
                  placeholder: 'Name',
                  title: 'Create env group'
                })

                if (!name) {
                  return
                }

                create(name)
              }}
            />
          }
        />
      )
    })
  }, [create, creating, setOptions])

  return (
    <List
      envGroups={envGroups}
      loading={loading}
      onItemPress={(id) =>
        navigate('EnvGroup', {
          id
        })
      }
      refetch={refetch}
    />
  )
}
