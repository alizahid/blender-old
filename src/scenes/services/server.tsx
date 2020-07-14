import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { img_ui_dark_edit } from '../../assets'
import { Button, KeyValue, Refresher, Separator } from '../../components'
import { Domains } from '../../components/services/settings'
import { useDeleteServer, useServiceSuspension } from '../../hooks'
import {
  useServer,
  useServiceDomains,
  useUpdateServer
} from '../../hooks/services'
import { dialog } from '../../lib'
import { ServerParamList } from '../../navigators/server'
import { colors, layout } from '../../styles'

interface Props {
  navigation: StackNavigationProp<ServerParamList, 'Settings'>
  route: RouteProp<ServerParamList, 'Settings'>
}

export const Server: FunctionComponent<Props> = ({
  navigation: { pop },
  route: {
    params: { id }
  }
}) => {
  const { loading, refetch, server } = useServer(id)

  const {
    domains,
    loading: loadingDomains,
    refetch: refetchDomains
  } = useServiceDomains(id)

  const { resume, resuming, suspend, suspending } = useServiceSuspension()
  const { remove, removing } = useDeleteServer()

  const {
    updateBaseDir,
    updateBuildCommand,
    updateDockerCommand,
    updateDockerfilePath,
    updateHealthCheckPath,
    updateInstanceCount,
    updateStartCommand,
    updatingBaseDir,
    updatingBuildCommand,
    updatingDockerCommand,
    updatingDockerfilePath,
    updatingHealthCheckPath,
    updatingInstanceCount,
    updatingStartCommand
  } = useUpdateServer()

  const isDocker = server?.env.id === 'docker'
  const isSuspended = server?.state === 'Suspended'

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="always"
      refreshControl={
        <Refresher
          onRefresh={() => {
            refetch()
            refetchDomains()
          }}
          refreshing={loading || loadingDomains}
        />
      }>
      {server && (
        <>
          <KeyValue
            label="Region"
            style={styles.item}
            value={server.region.description}
          />
          <KeyValue
            hidden
            label="Deploy hook"
            style={styles.item}
            value={`https://api.render.com/deploy/${id}?key=${server.deployKey}`}
            valueMono
          />
          <KeyValue
            actions={[
              {
                icon: img_ui_dark_edit,
                onPress: async () => {
                  const instances = await dialog.prompt({
                    autoCapitalize: 'none',
                    autoCorrect: false,
                    initialValue: String(server.extraInstances + 1),
                    keyboardType: 'number-pad',
                    message: 'Update the instance count for your server',
                    placeholder: '1',
                    title: 'Update instance count'
                  })

                  if (!instances) {
                    return
                  }

                  const count = Number(instances)

                  if (!count) {
                    return
                  }

                  updateInstanceCount(id, count)
                }
              }
            ]}
            label="Instances"
            loading={updatingInstanceCount}
            style={styles.item}
            value={String(server.extraInstances + 1)}
            valueMono
          />
          {isDocker ? (
            <>
              <KeyValue
                actions={[
                  {
                    icon: img_ui_dark_edit,
                    onPress: async () => {
                      const path = await dialog.prompt({
                        autoCapitalize: 'none',
                        autoCorrect: false,
                        initialValue: String(server.dockerfilePath),
                        message: 'Update the Dockerfile path for your server',
                        placeholder: 'yarn start',
                        title: 'Update Dockerfile path'
                      })

                      if (!path) {
                        return
                      }

                      updateDockerfilePath(id, path)
                    }
                  }
                ]}
                label="Dockerfile path"
                loading={updatingDockerfilePath}
                style={styles.item}
                value={server.dockerfilePath || '-'}
                valueMono
              />
              <KeyValue
                actions={[
                  {
                    icon: img_ui_dark_edit,
                    onPress: async () => {
                      const path = await dialog.prompt({
                        autoCapitalize: 'none',
                        autoCorrect: false,
                        initialValue: String(server.baseDir),
                        message:
                          'Update the Docker build context directory for your server',
                        placeholder: 'yarn',
                        title: 'Update Docker build context directory'
                      })

                      if (!path) {
                        return
                      }

                      updateBaseDir(id, path)
                    }
                  }
                ]}
                label="Docker build context directory"
                loading={updatingBaseDir}
                style={styles.item}
                value={server.baseDir || '-'}
                valueMono
              />
              <KeyValue
                actions={[
                  {
                    icon: img_ui_dark_edit,
                    onPress: async () => {
                      const command = await dialog.prompt({
                        autoCapitalize: 'none',
                        autoCorrect: false,
                        initialValue: String(server.dockerCommand),
                        message: 'Update the Docker command for your server',
                        placeholder: 'yarn',
                        title: 'Update Docker command'
                      })

                      if (!command) {
                        return
                      }

                      updateDockerCommand(id, command)
                    }
                  }
                ]}
                label="Docker command"
                loading={updatingDockerCommand}
                style={styles.item}
                value={server.dockerCommand || '-'}
                valueMono
              />
            </>
          ) : (
            <>
              <KeyValue
                actions={[
                  {
                    icon: img_ui_dark_edit,
                    onPress: async () => {
                      const command = await dialog.prompt({
                        autoCapitalize: 'none',
                        autoCorrect: false,
                        initialValue: server.buildCommand,
                        message: 'Update the build command for your server',
                        placeholder: 'yarn start',
                        title: 'Update build command'
                      })

                      if (!command) {
                        return
                      }

                      updateBuildCommand(id, command)
                    }
                  }
                ]}
                label="Build command"
                loading={updatingBuildCommand}
                style={styles.item}
                value={server.buildCommand}
                valueMono
              />
              <KeyValue
                actions={[
                  {
                    icon: img_ui_dark_edit,
                    onPress: async () => {
                      const path = await dialog.prompt({
                        autoCapitalize: 'none',
                        autoCorrect: false,
                        initialValue: server.startCommand,
                        message: 'Update the start command for your server',
                        placeholder: 'yarn',
                        title: 'Update start command'
                      })

                      if (!path) {
                        return
                      }

                      updateStartCommand(id, path)
                    }
                  }
                ]}
                label="Start command"
                loading={updatingStartCommand}
                style={styles.item}
                value={server.startCommand}
                valueMono
              />
            </>
          )}
          <KeyValue
            actions={[
              {
                icon: img_ui_dark_edit,
                onPress: async () => {
                  const path = await dialog.prompt({
                    autoCapitalize: 'none',
                    autoCorrect: false,
                    initialValue: server.healthCheckPath,
                    message: 'Update the health check path for your server',
                    placeholder: '/healthz',
                    title: 'Update health check path'
                  })

                  if (!path) {
                    return
                  }

                  updateHealthCheckPath(id, path)
                }
              }
            ]}
            label="Health check path"
            loading={updatingHealthCheckPath}
            style={styles.item}
            value={server.healthCheckPath || '-'}
            valueMono
          />
          <KeyValue
            label="Branch"
            style={styles.item}
            value={server.sourceBranch}
            valueMono
          />
          <KeyValue
            label="Auto deploy"
            style={styles.item}
            value={server.autoDeploy ? 'Yes' : 'No'}
          />
          <KeyValue
            label="Pull request reviews"
            style={styles.item}
            value={server.prPreviewsEnabled ? 'Enabled' : 'Disabled'}
          />
          {!!server.url && (
            <>
              <Separator />
              <Domains domains={domains} server={server} />
            </>
          )}
          <Separator />
          <View style={styles.footer}>
            <Button
              label={isSuspended ? 'Resume' : 'Suspend'}
              loading={resuming || suspending}
              onPress={() => {
                if (isSuspended) {
                  resume(id)
                } else {
                  suspend(id)
                }
              }}
              style={[
                styles.button,
                isSuspended ? styles.resume : styles.suspend
              ]}
            />
            <Button
              label="Delete"
              loading={removing}
              onPress={async () => {
                const response = await remove(id)

                if (response) {
                  pop()
                }
              }}
              style={[styles.button, styles.remove]}
            />
          </View>
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1
  },
  content: {
    flexGrow: 1,
    paddingTop: layout.margin
  },
  footer: {
    flexDirection: 'row',
    padding: layout.margin
  },
  item: {
    marginBottom: layout.margin,
    marginHorizontal: layout.margin
  },
  remove: {
    backgroundColor: colors.status.red,
    marginLeft: layout.margin
  },
  resume: {
    backgroundColor: colors.status.green
  },
  suspend: {
    backgroundColor: colors.status.orange
  }
})
