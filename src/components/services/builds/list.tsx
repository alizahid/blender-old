import { orderBy } from 'lodash'
import React, { FunctionComponent } from 'react'
import { FlatList } from 'react-native'

import { Refresher, Separator } from '../..'
import { IBuild } from '../../../graphql/types'
import { Card } from './card'

interface Props {
  builds: IBuild[]
  loading: boolean

  refetch: () => void
}

export const List: FunctionComponent<Props> = ({
  builds,
  loading,
  refetch
}) => (
  <FlatList
    ItemSeparatorComponent={Separator}
    data={orderBy(builds, 'createdAt', 'desc')}
    refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}
    renderItem={({ item }) => <Card build={item} />}
  />
)
