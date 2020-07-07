import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect } from 'react'

import { img_ui_dark_add } from '../../assets'
import { Header, HeaderButton } from '../../components'
import { List } from '../../components/env-groups'
import { useEnvGroups } from '../../hooks'
import { EnvGroupsParamList } from '../../navigators/env-groups'

interface Props {
  navigation: StackNavigationProp<EnvGroupsParamList, 'EnvGroups'>
  route: RouteProp<EnvGroupsParamList, 'EnvGroups'>
}

export const EnvGroups: FunctionComponent<Props> = ({
  navigation: { navigate, setOptions }
}) => {
  const { envGroups, loading, refetch } = useEnvGroups()

  useEffect(() => {
    setOptions({
      header: (props) => (
        <Header
          {...props}
          right={
            <HeaderButton
              icon={img_ui_dark_add}
              onPress={() => navigate('CreateEnvGroup')}
            />
          }
        />
      )
    })
  }, [navigate, setOptions])

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
