import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useState } from 'react'
import { ScrollView } from 'react-native'

import { Overlay, Refresher } from '../../components'
import { Form, Headers as List } from '../../components/services/headers'
import { IHeader } from '../../graphql/types'
import { useServiceHeaders } from '../../hooks'
import { StaticSiteParamList } from '../../navigators/static-site'

interface Props {
  navigation: StackNavigationProp<StaticSiteParamList, 'Headers'>
  route: RouteProp<StaticSiteParamList, 'Headers'>
}

export const Headers: FunctionComponent<Props> = ({
  route: {
    params: { id }
  }
}) => {
  const {
    createHeader,
    headers,
    loading,
    refetch,
    removeHeader,
    updateHeader,
    updating
  } = useServiceHeaders(id)

  const [editing, setEditing] = useState<IHeader | true>()

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="always"
        refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}>
        <List
          headers={headers}
          loading={updating}
          onCreate={() => setEditing(true)}
          onEdit={(header) => setEditing(header)}
          onRemove={(id) => removeHeader(id)}
        />
      </ScrollView>
      {editing && (
        <Overlay>
          <Form
            header={editing === true ? undefined : editing}
            loading={updating}
            onCancel={() => setEditing(undefined)}
            onSave={(header) => {
              if (editing === true) {
                return createHeader(header)
              } else {
                return updateHeader(header)
              }
            }}
          />
        </Overlay>
      )}
    </>
  )
}
