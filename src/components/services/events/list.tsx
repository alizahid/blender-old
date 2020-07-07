import { orderBy } from 'lodash'
import React, { FunctionComponent } from 'react'
import { FlatList } from 'react-native'

import { Refresher, Separator } from '../..'
import { IServiceEvent } from '../../../graphql/types'
import { Card } from './card'

interface Props {
  events: IServiceEvent[]
  loading: boolean

  refetch: () => void
}

export const List: FunctionComponent<Props> = ({
  events,
  loading,
  refetch
}) => (
  <FlatList
    ItemSeparatorComponent={Separator}
    data={orderBy(events, 'createdAt', 'desc')}
    refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}
    renderItem={({ item }) => <Card event={item} />}
  />
)
