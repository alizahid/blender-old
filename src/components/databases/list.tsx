import React, { FunctionComponent } from 'react'
import { FlatList, StyleSheet } from 'react-native'

import { Empty, Refresher } from '..'
import { IDatabase } from '../../graphql/types'
import { Separator } from '../separator'
import { Card } from './card'

interface Props {
  databases: IDatabase[]
  loading: boolean

  onItemPress: (id: string) => void
  refetch: () => void
}

export const List: FunctionComponent<Props> = ({
  databases,
  loading,
  onItemPress,
  refetch
}) => (
  <FlatList
    ItemSeparatorComponent={Separator}
    ListEmptyComponent={
      loading ? null : (
        <Empty message="You haven't created any databases yet." />
      )
    }
    contentContainerStyle={styles.content}
    data={databases}
    refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}
    renderItem={({ item }) => (
      <Card database={item} onPress={(id) => onItemPress(id)} />
    )}
  />
)

const styles = StyleSheet.create({
  content: {
    flexGrow: 1
  }
})
