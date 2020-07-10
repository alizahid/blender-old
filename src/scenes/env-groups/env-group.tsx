import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useEffect } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { Button, Refresher, Separator } from '../../components'
import {
  EnvVariables,
  LinkedServices,
  SecretFiles
} from '../../components/env-groups'
import {
  useDeleteEnvGroup,
  useEnvGroup,
  useUpdateEnvGroupEnvVars,
  useUpdateEnvGroupSecretFiles
} from '../../hooks'
import { dialog } from '../../lib'
import { EnvGroupsParamList } from '../../navigators/env-groups'
import { colors, layout, typography } from '../../styles'

interface Props {
  navigation: StackNavigationProp<EnvGroupsParamList, 'EnvGroup'>
  route: RouteProp<EnvGroupsParamList, 'EnvGroup'>
}

export const EnvGroup: FunctionComponent<Props> = ({
  navigation: { pop, setOptions },
  route: {
    params: { id }
  }
}) => {
  const { envGroup, loading, refetch, services } = useEnvGroup(id)
  const { loading: removingEnvGroup, remove } = useDeleteEnvGroup()

  const {
    createEnvVar,
    loading: removingEnvVar,
    removeEnvVar,
    updateEnvVars
  } = useUpdateEnvGroupEnvVars()
  const {
    createSecretFile,
    loading: removingSecretFile,
    removeSecretFile,
    updateSecretFiles
  } = useUpdateEnvGroupSecretFiles()

  useEffect(() => {
    setOptions({
      title: envGroup?.name ?? 'Env Group'
    })
  }, [envGroup?.name, setOptions])

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}>
      {envGroup && (
        <>
          <EnvVariables
            envVars={envGroup.envVars.filter(({ isFile }) => !isFile)}
            onCreate={async () => {
              const response = await dialog.keyValue({
                labelPlaceholder: 'Key',
                labelStyle: styles.code,
                title: 'Create env var',
                valueMultiline: true,
                valuePlaceholder: 'Value',
                valueStyle: styles.code
              })

              if (response) {
                const { key, value } = response

                createEnvVar(envGroup, {
                  isFile: false,
                  key,
                  value
                })
              }
            }}
            onEdit={async (envVar) => {
              const response = await dialog.keyValue({
                initialLabel: envVar.key,
                initialValue: envVar.value,
                labelPlaceholder: 'Key',
                labelStyle: styles.code,
                title: 'Edit env var',
                valueMultiline: true,
                valuePlaceholder: 'Value',
                valueStyle: styles.code
              })

              if (response) {
                const { key, value } = response

                updateEnvVars(envGroup, {
                  id: envVar.id,
                  isFile: false,
                  key,
                  value
                })
              }
            }}
            onRemove={(id) => removeEnvVar(envGroup, id)}
            removing={removingEnvVar}
          />
          <Separator />
          <SecretFiles
            envVars={envGroup.envVars.filter(({ isFile }) => isFile)}
            onCreate={async () => {
              const response = await dialog.keyValue({
                labelPlaceholder: 'Key',
                labelStyle: styles.code,
                title: 'Create secret file',
                valueMultiline: true,
                valuePlaceholder: 'Value',
                valueStyle: styles.code
              })

              if (response) {
                const { key, value } = response

                createSecretFile(envGroup, {
                  isFile: true,
                  key,
                  value
                })
              }
            }}
            onEdit={async (envVar) => {
              const response = await dialog.keyValue({
                initialLabel: envVar.key,
                initialValue: envVar.value,
                labelPlaceholder: 'Key',
                labelStyle: styles.code,
                title: 'Edit secret file',
                valueMultiline: true,
                valuePlaceholder: 'Value',
                valueStyle: styles.code
              })

              if (response) {
                const { key, value } = response

                updateSecretFiles(envGroup, {
                  id: envVar.id,
                  isFile: true,
                  key,
                  value
                })
              }
            }}
            onRemove={(id) => removeSecretFile(envGroup, id)}
            removing={removingSecretFile}
          />
          <Separator />
          <LinkedServices services={services} />
          <Separator />
          <Button
            label="Delete env group"
            loading={removingEnvGroup}
            onPress={async () => {
              const response = await remove(envGroup.id)

              if (response) {
                pop()
              }
            }}
            small
            style={styles.remove}
          />
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  code: {
    ...typography.code
  },
  remove: {
    alignSelf: 'center',
    backgroundColor: colors.status.red,
    marginVertical: layout.margin
  }
})
