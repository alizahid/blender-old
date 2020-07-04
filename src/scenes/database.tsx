import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { img_ui_dark_add } from '../assets'
import { Header, HeaderButton, Refresher } from '../components'
import { Backups, Details } from '../components/databases'
import { useDatabase } from '../hooks'
import { DatabasesParamList } from '../navigators/databases'
import { layout } from '../styles'

interface Props {
  navigation: StackNavigationProp<DatabasesParamList, 'Database'>
  route: RouteProp<DatabasesParamList, 'Database'>
}

export const Database: FunctionComponent<Props> = ({
  navigation: { navigate, setOptions },
  route: {
    params: { id }
  }
}) => {
  const { backups, database, loading, refetch } = useDatabase(id)

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
      ),
      title: database?.name ?? 'Database'
    })
  }, [database?.name, navigate, setOptions])

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      nestedScrollEnabled
      refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}>
      {database && (
        <>
          <Details database={database} />
          <Backups backups={backups} />
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: layout.padding
  }
})
