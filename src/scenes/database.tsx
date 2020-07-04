import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect } from 'react'

import { img_ui_dark_add } from '../assets'
import { Header, HeaderButton } from '../components'
import { List } from '../components/databases'
import { useDatabases } from '../hooks'
import { DatabasesParamList } from '../navigators/databases'

interface Props {
  navigation: StackNavigationProp<DatabasesParamList, 'Database'>
  route: RouteProp<DatabasesParamList, 'Database'>
}

export const Database: FunctionComponent<Props> = ({
  navigation: { navigate, setOptions }
}) => {
  const { databases, loading, refetch } = useDatabases()

  useEffect(() => {
    setOptions({
      header: (props) => (
        <Header
          {...props}
          right={
            <HeaderButton
              icon={img_ui_dark_add}
              onPress={() => navigate('Create')}
            />
          }
        />
      )
    })
  }, [navigate, setOptions])

  return (
    <List
      databases={databases}
      loading={loading}
      onItemPress={(id) =>
        navigate('Database', {
          id
        })
      }
      refetch={refetch}
    />
  )
}
