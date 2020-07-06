import { orderBy } from 'lodash'
import React, { FunctionComponent } from 'react'
import { FlatList, StyleSheet } from 'react-native'

import { Empty, Refresher } from '..'
import { IEnvGroup } from '../../graphql/types'
import { Separator } from '../separator'
import { Card } from './card'

interface Props {
  envGroups: IEnvGroup[]
  loading: boolean

  onItemPress: (id: string) => void
  refetch: () => void
}

export const List: FunctionComponent<Props> = ({
  envGroups,
  loading,
  onItemPress,
  refetch
}) => (
  <FlatList
    ItemSeparatorComponent={Separator}
    ListEmptyComponent={
      loading ? null : (
        <Empty message="You haven't created any env groups yet." />
      )
    }
    contentContainerStyle={styles.content}
    data={orderBy(envGroups, 'updatedAt', 'desc')}
    refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}
    renderItem={({ item }) => (
      <Card envGroup={item} onPress={(id) => onItemPress(id)} />
    )}
  />
)

const styles = StyleSheet.create({
  content: {
    flexGrow: 1
  }
})
