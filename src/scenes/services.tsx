import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'

import { List } from '../components/services'
import { useServices } from '../hooks'
import { ServicesParamList } from '../navigators/services'

interface Props {
  navigation: StackNavigationProp<ServicesParamList, 'Services'>
  route: RouteProp<ServicesParamList, 'Services'>
}

export const Services: FunctionComponent<Props> = () => {
  const { loading, refetch, services } = useServices()

  return <List loading={loading} refetch={refetch} services={services} />
}
