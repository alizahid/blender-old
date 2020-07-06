import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { Button, Refresher, Separator } from '../components'
import { Backups, Details } from '../components/databases'
import { useDatabase, useDeleteDatabase } from '../hooks'
import { DatabasesParamList } from '../navigators/databases'
import { colors, layout } from '../styles'

interface Props {
  navigation: StackNavigationProp<DatabasesParamList, 'Database'>
  route: RouteProp<DatabasesParamList, 'Database'>
}

export const Database: FunctionComponent<Props> = ({
  navigation: { pop, setOptions },
  route: {
    params: { id }
  }
}) => {
  const { backups, database, loading, refetch } = useDatabase(id)
  const { loading: removing, remove } = useDeleteDatabase()

  useEffect(() => {
    setOptions({
      title: database?.name ?? 'Database'
    })
  }, [database?.name, setOptions])

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}>
      {database && (
        <>
          <Details database={database} />
          <Separator />
          <Backups backups={backups} />
          <Separator />
          <Button
            label="Delete database"
            loading={removing}
            onPress={async () => {
              await remove(database.id)

              pop()
            }}
            small
            style={styles.remove}
          />
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  remove: {
    alignSelf: 'center',
    backgroundColor: colors.status.red,
    marginVertical: layout.margin
  }
})
