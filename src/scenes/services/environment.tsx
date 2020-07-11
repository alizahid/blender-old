import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { Refresher, Separator } from '../../components'
import { EnvVariables, SecretFiles } from '../../components/env-groups'
import { EnvGroups } from '../../components/services/environment'
import { useEnvGroups, useServiceEnv, useServiceEnvGroups } from '../../hooks'
import { dialog } from '../../lib'
import { ServerParamList } from '../../navigators/server'
import { typography } from '../../styles'

interface Props {
  navigation: StackNavigationProp<ServerParamList, 'Environment'>
  route: RouteProp<ServerParamList, 'Environment'>
}

export const Environment: FunctionComponent<Props> = ({
  route: {
    params: { id }
  }
}) => {
  const envVars = useServiceEnv(id, false)
  const secretFiles = useServiceEnv(id, true)
  const envGroups = useServiceEnvGroups(id)
  const allEnvGroups = useEnvGroups()

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      refreshControl={
        <Refresher
          onRefresh={() => {
            envVars.refetch()
            secretFiles.refetch()
            envGroups.refetch()
            allEnvGroups.refetch()
          }}
          refreshing={
            envVars.loading ||
            secretFiles.loading ||
            envGroups.loading ||
            allEnvGroups.loading
          }
        />
      }>
      <EnvVariables
        envVars={envVars.envVars}
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

            envVars.createEnvVar({
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

            envVars.updateEnvVar({
              id: envVar.id,
              isFile: false,
              key,
              value
            })
          }
        }}
        onRemove={(id) => envVars.removeEnvVar(id)}
        removing={envVars.updating}
      />
      <Separator />
      <SecretFiles
        envVars={secretFiles.envVars}
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

            secretFiles.createSecretFile({
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

            secretFiles.updateSecretFile({
              id: envVar.id,
              isFile: true,
              key,
              value
            })
          }
        }}
        onRemove={(id) => secretFiles.removeSecretFile(id)}
        removing={secretFiles.updating}
      />
      <Separator />
      <EnvGroups
        envGroups={allEnvGroups.envGroups}
        linkedGroups={envGroups.envGroups}
        linking={envGroups.linking}
        onLink={(envGroup) => envGroups.link(envGroup)}
        onUnlink={(envGroup) => envGroups.unlink(envGroup)}
        unlinking={envGroups.unlinking}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  code: {
    ...typography.code
  }
})
