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
import { EnvGroupsParamList } from '../../navigators/env-groups'
import { colors, layout } from '../../styles'

interface Props {
  navigation: StackNavigationProp<EnvGroupsParamList, 'EnvGroup'>
  route: RouteProp<EnvGroupsParamList, 'EnvGroup'>
}

export const EnvGroup: FunctionComponent<Props> = ({
  navigation: { navigate, pop, setOptions },
  route: {
    params: { id }
  }
}) => {
  const { envGroup, loading, refetch, services } = useEnvGroup(id)
  const { loading: removingEnvGroup, remove } = useDeleteEnvGroup()
  const { loading: removingEnvVar, removeEnvVar } = useUpdateEnvGroupEnvVars()
  const {
    loading: removingSecretFile,
    removeSecretFile
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
            onCreate={() =>
              navigate('CreateEnvVar', {
                envGroup,
                isFile: false
              })
            }
            onEdit={(envVar) =>
              navigate('EditEnvVar', {
                envGroup,
                id: envVar.id,
                isFile: false
              })
            }
            onRemove={(id) => removeEnvVar(envGroup, id)}
            removing={removingEnvVar}
          />
          <Separator />
          <SecretFiles
            envVars={envGroup.envVars.filter(({ isFile }) => isFile)}
            onCreate={() =>
              navigate('CreateEnvVar', {
                envGroup,
                isFile: true
              })
            }
            onEdit={(envVar) =>
              navigate('EditEnvVar', {
                envGroup,
                id: envVar.id,
                isFile: true
              })
            }
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
  remove: {
    alignSelf: 'center',
    backgroundColor: colors.status.red,
    marginVertical: layout.margin
  }
})
