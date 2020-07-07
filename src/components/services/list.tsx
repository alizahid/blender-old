import React, { FunctionComponent } from 'react'
import { FlatList, StyleSheet } from 'react-native'

import { Empty, Refresher } from '..'
import { IService } from '../../graphql/types'
import { Separator } from '../separator'
import { Card } from './card'

interface Props {
  services: IService[]
  loading: boolean

  onItemPress: (id: string) => void
  refetch: () => void
}

export const List: FunctionComponent<Props> = ({
  loading,
  onItemPress,
  refetch,
  services
}) => (
  <FlatList
    ItemSeparatorComponent={Separator}
    ListEmptyComponent={
      loading ? null : <Empty message="You haven't created any services yet." />
    }
    contentContainerStyle={styles.content}
    data={services}
    refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}
    renderItem={({ item }) => (
      <Card onPress={(id) => onItemPress(id)} service={item} />
    )}
  />
)

const styles = StyleSheet.create({
  content: {
    flexGrow: 1
  }
})
