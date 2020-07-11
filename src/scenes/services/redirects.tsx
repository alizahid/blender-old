import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useState } from 'react'
import { ScrollView } from 'react-native'

import { Overlay, Refresher, Separator } from '../../components'
import { Form, Rules } from '../../components/services/redirects'
import { IRedirectRule } from '../../graphql/types'
import { useServiceRedirects } from '../../hooks'
import { StaticSiteParamList } from '../../navigators/static-site'

interface Props {
  navigation: StackNavigationProp<StaticSiteParamList, 'Redirects'>
  route: RouteProp<StaticSiteParamList, 'Redirects'>
}

export const Redirects: FunctionComponent<Props> = ({
  route: {
    params: { id }
  }
}) => {
  const {
    createRule,
    loading,
    moveRule,
    refetch,
    removeRule,
    rules,
    updateRule,
    updating
  } = useServiceRedirects(id)

  const [editing, setEditing] = useState<IRedirectRule>()

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="always"
        refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}>
        <Rules
          loading={updating}
          onEdit={(rule) => setEditing(rule)}
          onMoveDown={(id) => moveRule(id, 'down')}
          onMoveUp={(id) => moveRule(id, 'up')}
          onRemove={(id) => removeRule(id)}
          rules={rules}
        />
        <Separator />
        <Form loading={updating} onSave={(rule) => createRule(rule)} />
      </ScrollView>
      {editing && (
        <Overlay>
          <Form
            loading={updating}
            onCancel={() => setEditing(undefined)}
            onSave={(rule) => updateRule(rule)}
            rule={editing}
          />
        </Overlay>
      )}
    </>
  )
}
