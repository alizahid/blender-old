import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { img_ui_dark_edit } from '../../assets'
import { Button, KeyValue, Refresher, Separator } from '../../components'
import { useDeleteServer, useServiceSuspension } from '../../hooks'
import { useServer, useUpdateServer } from '../../hooks/services'
import { dialog } from '../../lib'
import { StaticSiteParamList } from '../../navigators/static-site'
import { colors, layout } from '../../styles'

interface Props {
  navigation: StackNavigationProp<StaticSiteParamList, 'Settings'>
  route: RouteProp<StaticSiteParamList, 'Settings'>
}

export const StaticSite: FunctionComponent<Props> = ({
  navigation: { pop },
  route: {
    params: { id }
  }
}) => {
  const { loading, refetch, server } = useServer(id)

  const { resume, resuming, suspend, suspending } = useServiceSuspension()
  const { remove, removing } = useDeleteServer()

  const {
    updateBuildCommand,
    updatePublishDirectory,
    updatingBuildCommand,
    updatingPublishDirectory
  } = useUpdateServer()

  const isSuspended = server?.state === 'Suspended'

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="always"
      refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}>
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
                  const command = await dialog.prompt({
                    initialValue: server.buildCommand,
                    message: 'Update the build command for your static site',
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
                    initialValue: server.staticPublishPath,
                    message:
                      'Update the publish directory path for your static site',
                    placeholder: 'yarn',
                    title: 'Update publish directory path'
                  })

                  if (!path) {
                    return
                  }

                  updatePublishDirectory(id, path)
                }
              }
            ]}
            label="Publish directory"
            loading={updatingPublishDirectory}
            style={styles.item}
            value={server.staticPublishPath}
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
