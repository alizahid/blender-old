import { orderBy } from 'lodash'
import React, { FunctionComponent } from 'react'
import { FlatList, StyleSheet } from 'react-native'

import { Empty, Refresher } from '..'
import { IService } from '../../graphql/types'
import { Separator } from '../separator'
import { Card } from './card'

interface Props {
  services: IService[]
  loading: boolean

  refetch: () => void
}

export const List: FunctionComponent<Props> = ({
  loading,
  refetch,
  services
}) => (
  <FlatList
    ItemSeparatorComponent={Separator}
    ListEmptyComponent={
      loading ? null : <Empty message="You haven't created any services yet." />
    }
    contentContainerStyle={styles.content}
    data={orderBy(services, 'updatedAt', 'desc')}
    refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}
    renderItem={({ item }) => <Card service={item} />}
  />
)

const styles = StyleSheet.create({
  content: {
    flexGrow: 1
  }
})
