import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import cron from 'cronstrue'
import React, { FunctionComponent } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { img_ui_dark_edit } from '../../assets'
import { Button, KeyValue, Refresher, Separator } from '../../components'
import { useCronJob, useDeleteCronJob, useServiceSuspension } from '../../hooks'
import { useUpdateCronJob } from '../../hooks/services'
import { dialog } from '../../lib'
import { CronJobParamList } from '../../navigators/cron-job'
import { colors, layout } from '../../styles'

interface Props {
  navigation: StackNavigationProp<CronJobParamList, 'Settings'>
  route: RouteProp<CronJobParamList, 'Settings'>
}

export const CronJob: FunctionComponent<Props> = ({
  navigation: { pop },
  route: {
    params: { id }
  }
}) => {
  const { cronJob, loading, refetch } = useCronJob(id)

  const { resume, resuming, suspend, suspending } = useServiceSuspension()
  const { remove, removing } = useDeleteCronJob()

  const {
    updateBuildCommand,
    updateCommand,
    updateSchedule,
    updatingBuildCommand,
    updatingCommand,
    updatingSchedule
  } = useUpdateCronJob()

  const isSuspended = cronJob?.state === 'Suspended'

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="always"
      refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}>
      {cronJob && (
        <>
          <KeyValue
            label="Region"
            style={styles.item}
            value={cronJob.region.description}
          />
          <KeyValue
            actions={[
              {
                icon: img_ui_dark_edit,
                onPress: async () => {
                  const schedule = await dialog.prompt({
                    autoCapitalize: 'none',
                    autoCorrect: false,
                    initialValue: cronJob.schedule,
                    message: 'Update the schedule for your cron job',
                    placeholder: '*/5 * * * *',
                    title: 'Update schedule'
                  })

                  if (!schedule) {
                    return
                  }

                  updateSchedule(id, schedule)
                }
              }
            ]}
            description={cron.toString(cronJob.schedule)}
            label="Schedule"
            loading={updatingSchedule}
            style={styles.item}
            value={cronJob.schedule}
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
                    initialValue: cronJob.command,
                    message: 'Update the command for your cron job',
                    placeholder: 'yarn start',
                    title: 'Update command'
                  })

                  if (!command) {
                    return
                  }

                  updateCommand(id, command)
                }
              }
            ]}
            label="Command"
            loading={updatingCommand}
            style={styles.item}
            value={cronJob.command}
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
                    initialValue: cronJob.buildCommand,
                    message: 'Update the build command for your cron job',
                    placeholder: 'yarn',
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
            value={cronJob.buildCommand}
            valueMono
          />
          <KeyValue
            label="Branch"
            style={styles.item}
            value={cronJob.sourceBranch}
            valueMono
          />
          <KeyValue
            label="Auto deploy"
            style={styles.item}
            value={cronJob.autoDeploy ? 'Yes' : 'No'}
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
