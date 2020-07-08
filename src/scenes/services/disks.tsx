import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { compact } from 'lodash'
import React, { FunctionComponent } from 'react'
import { ScrollView } from 'react-native'

import { Refresher, Separator } from '../../components'
import { Disk, Metrics, Snapshots } from '../../components/services/disks'
import { useRestoreDiskSnapshot, useServiceDisk } from '../../hooks'
import { ServerParamList } from '../../navigators/server'

interface Props {
  navigation: StackNavigationProp<ServerParamList, 'Disks'>
  route: RouteProp<ServerParamList, 'Disks'>
}

export const Disks: FunctionComponent<Props> = ({
  route: {
    params: { id }
  }
}) => {
  const { disk, loading, refetch, snapshots } = useServiceDisk(id)
  const { loading: restoring, restore } = useRestoreDiskSnapshot()

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}>
      {disk && (
        <>
          <Disk disk={disk} />
          <Separator />
          <Metrics disk={disk} />
          <Separator />
          <Snapshots
            loading={restoring}
            onItemPress={(key: string) => restore(disk.id, key)}
            snapshots={compact(snapshots)}
          />
        </>
      )}
    </ScrollView>
  )
}
