import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { ScrollView } from 'react-native'

import { Refresher, Separator } from '../../components'
import {
  Bandwidth as Usage,
  Compute,
  Memory
} from '../../components/services/metrics'
import { useServiceMetrics } from '../../hooks'
import { useServerBandwidth } from '../../hooks/services'
import { ServerParamList } from '../../navigators/server'

interface Props {
  navigation: StackNavigationProp<ServerParamList, 'Metrics'>
  route: RouteProp<ServerParamList, 'Metrics'>
}

export const Metrics: FunctionComponent<Props> = ({
  route: {
    params: { id }
  }
}) => {
  const { loading, metrics, refetch } = useServiceMetrics(id)

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}>
      {metrics && (
        <>
          <Compute metrics={metrics} />
          <Separator />
          <Memory metrics={metrics} />
        </>
      )}
    </ScrollView>
  )
}

export const Bandwidth: FunctionComponent<Props> = ({
  route: {
    params: { id }
  }
}) => {
  const { bandwidth, loading, refetch } = useServerBandwidth(id)

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}>
      {bandwidth && <Usage bandwidth={bandwidth} />}
    </ScrollView>
  )
}
