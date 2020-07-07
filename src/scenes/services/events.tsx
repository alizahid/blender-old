import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'

import { List } from '../../components/services/events'
import { useServiceEvents } from '../../hooks'
import { ServerParamList } from '../../navigators/server'

interface Props {
  navigation: StackNavigationProp<ServerParamList, 'Events'>
  route: RouteProp<ServerParamList, 'Events'>
}

export const Events: FunctionComponent<Props> = ({
  route: {
    params: { id }
  }
}) => {
  const { events, loading, refetch } = useServiceEvents(id)

  return <List events={events} loading={loading} refetch={refetch} />
}
