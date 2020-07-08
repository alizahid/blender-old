import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'

import { List } from '../../components/services/logs'
import { useServiceLogs } from '../../hooks'
import { ServerParamList } from '../../navigators/server'

interface Props {
  navigation: StackNavigationProp<ServerParamList, 'Logs'>
  route: RouteProp<ServerParamList, 'Logs'>
}

export const Logs: FunctionComponent<Props> = ({
  route: {
    params: { id }
  }
}) => {
  const { loading, logs, refetch } = useServiceLogs(id)

  return <List loading={loading} logs={logs} refetch={refetch} />
}
