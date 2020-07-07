import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text } from 'react-native'

import { img_ui_dark_check } from '../../assets'
import { Header, HeaderButton, TextBox } from '../../components'
import { useCreateEnvGroup } from '../../hooks'
import { EnvGroupsParamList } from '../../navigators/env-groups'
import { colors, layout, typography } from '../../styles'

interface Props {
  navigation: StackNavigationProp<EnvGroupsParamList, 'CreateEnvGroup'>
  route: RouteProp<EnvGroupsParamList, 'CreateEnvGroup'>
}

export const CreateEnvGroup: FunctionComponent<Props> = ({
  navigation: { replace, setOptions }
}) => {
  const { create, loading } = useCreateEnvGroup()

  const [name, setName] = useState<string>()

  useEffect(() => {
    setOptions({
      header: (props) => (
        <Header
          {...props}
          loading={loading}
          right={
            name ? (
              <HeaderButton
                icon={img_ui_dark_check}
                onPress={async () => {
                  const response = await create(name)

                  if (response?.data?.createEnvGroup.id) {
                    replace('EnvGroup', {
                      id: response.data.createEnvGroup.id
                    })
                  }
                }}
              />
            ) : undefined
          }
        />
      )
    })
  }, [create, loading, name, replace, setOptions])

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="always">
      <Text style={styles.label}>Name</Text>
      <TextBox
        onChangeText={(name) => setName(name)}
        placeholder="Name"
        style={styles.input}
        value={name}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: layout.margin
  },
  input: {
    backgroundColor: colors.backgroundDark,
    marginTop: layout.padding
  },
  label: {
    ...typography.small,
    ...typography.medium
  }
})
