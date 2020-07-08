import { orderBy } from 'lodash'
import React, { FunctionComponent } from 'react'
import { FlatList, StyleSheet } from 'react-native'

import { Refresher } from '../..'
import { ILogEntry } from '../../../graphql/types'
import { colors, layout } from '../../../styles'
import { Card } from './card'

interface Props {
  logs: ILogEntry[]
  loading: boolean

  refetch: () => void
}

export const List: FunctionComponent<Props> = ({ loading, logs, refetch }) => (
  <FlatList
    contentContainerStyle={styles.content}
    data={orderBy(logs, 'timestamp', 'desc')}
    inverted
    refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}
    renderItem={({ item }) => <Card log={item} />}
    style={styles.main}
  />
)

const styles = StyleSheet.create({
  content: {
    paddingVertical: layout.padding
  },
  main: {
    backgroundColor: colors.foreground
  }
})
