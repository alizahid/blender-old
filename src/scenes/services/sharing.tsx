import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { ScrollView } from 'react-native'

import { Refresher, Separator } from '../../components'
import { Collaborators, Invite } from '../../components/services/sharing'
import {
  useAddCollaborator,
  useRemoveCollaborator,
  useServiceCollaborators
} from '../../hooks'
import { ServerParamList } from '../../navigators/server'

interface Props {
  navigation: StackNavigationProp<ServerParamList, 'Sharing'>
  route: RouteProp<ServerParamList, 'Sharing'>
}

export const Sharing: FunctionComponent<Props> = ({
  route: {
    params: { id }
  }
}) => {
  const {
    collaborators,
    loading,
    owner,
    pending,
    refetch
  } = useServiceCollaborators(id)

  const { add, adding } = useAddCollaborator()
  const { remove, removing } = useRemoveCollaborator()

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}>
      {collaborators && owner && pending && (
        <>
          <Collaborators
            collaborators={collaborators}
            onRemove={(userId) => remove(id, userId)}
            owner={owner}
            pending={pending}
            removing={removing}
          />
          <Separator />
          <Invite loading={adding} onAdd={(email) => add(id, email)} />
        </>
      )}
    </ScrollView>
  )
}
