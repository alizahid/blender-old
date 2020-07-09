import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'

import { List } from '../../components/services/builds'
import { useBuildsForCronJob } from '../../hooks'
import { CronJobParamList } from '../../navigators/cron-job'

interface Props {
  navigation: StackNavigationProp<CronJobParamList, 'Builds'>
  route: RouteProp<CronJobParamList, 'Builds'>
}

export const Builds: FunctionComponent<Props> = ({
  route: {
    params: { id }
  }
}) => {
  const { builds, loading, refetch } = useBuildsForCronJob(id)

  return <List builds={builds} loading={loading} refetch={refetch} />
}
