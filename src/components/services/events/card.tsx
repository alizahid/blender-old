import { compact } from 'lodash'
import moment from 'moment'
import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Image, { Source } from 'react-native-fast-image'

import {
  img_events_build_cancelled,
  img_events_build_failed,
  img_events_build_started,
  img_events_build_succeeded,
  img_events_cron_job_cancelled,
  img_events_cron_job_started,
  img_events_cron_job_succeeded,
  img_events_cron_job_triggered,
  img_events_default,
  img_events_deployment_cancelled,
  img_events_deployment_failed,
  img_events_deployment_started,
  img_events_deployment_succeeded,
  img_events_server_available,
  img_events_server_failed,
  img_events_service_resumed,
  img_events_service_suspended
} from '../../../assets'
import {
  IBranchDeleted,
  IBuildEnded,
  IBuildStarted,
  ICronJobRunEnded,
  ICronJobRunStarted,
  IDeployEnded,
  IDeployStarted,
  IDiskEvent,
  IExtraInstancesChanged,
  IFailureReason,
  IPlanChanged,
  IServerAvailable,
  IServerFailed,
  IServiceResumed,
  IServiceSuspended,
  ISuspenderAdded,
  ISuspenderRemoved
} from '../../../graphql/types'
import { useAuth } from '../../../store'
import { colors, layout, typography } from '../../../styles'

type Event =
  | IBranchDeleted
  | IBuildStarted
  | ISuspenderAdded
  | IServiceResumed
  | IPlanChanged
  | ICronJobRunStarted
  | IExtraInstancesChanged
  | IDeployEnded
  | IServiceSuspended
  | ISuspenderRemoved
  | ICronJobRunEnded
  | IBuildEnded
  | IDeployStarted
  | IDiskEvent
  | IServerFailed
  | IServerAvailable

interface Props {
  event: Event
}

export const Card: FunctionComponent<Props> = ({ event }) => {
  const [{ id }] = useAuth()

  return (
    <View style={styles.main}>
      <Image source={getIcon(event)} style={styles.icon} />
      <View style={styles.content}>
        <Text style={styles.message}>{getMessage(event, id)}</Text>
        <Text style={styles.time}>{moment(event.timestamp).format('LLL')}</Text>
        {getMessage(event) === 'Unknown event' && (
          <Text
            style={{
              ...typography.codeSmall,
              marginTop: layout.margin
            }}>
            {JSON.stringify(event, null, 2)}
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginLeft: layout.margin
  },
  icon: {
    height: layout.icon * 2,
    width: layout.icon * 2
  },
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: layout.margin
  },
  message: {
    ...typography.regular,
    color: colors.foreground
  },
  time: {
    ...typography.small,
    color: colors.foregroundLight,
    marginTop: layout.padding
  }
})

const getIcon = (event: Event): Source => {
  switch (event.__typename) {
    case 'BuildStarted':
      return img_events_build_started

    case 'BuildEnded':
      return event.status === 2
        ? img_events_build_succeeded
        : event.status === 3
        ? img_events_build_failed
        : event.status === 4
        ? img_events_build_cancelled
        : img_events_build_started

    case 'CronJobRunStarted':
      return event.triggeredByUser
        ? img_events_cron_job_triggered
        : img_events_cron_job_started

    case 'CronJobRunEnded':
      return event.status === 2
        ? img_events_cron_job_succeeded
        : event.status === 3
        ? img_events_cron_job_cancelled
        : event.status === 4
        ? img_events_cron_job_cancelled
        : img_events_cron_job_started

    case 'DeployStarted':
      return img_events_deployment_started

    case 'DeployEnded':
      return event.status === 2
        ? img_events_deployment_succeeded
        : event.status === 3
        ? img_events_deployment_failed
        : event.status === 4
        ? img_events_deployment_cancelled
        : img_events_deployment_started

    case 'ServerAvailable':
      return img_events_server_available

    case 'ServerFailed':
      return img_events_server_failed

    case 'ServiceSuspended':
      return img_events_service_suspended

    case 'ServiceResumed':
      return img_events_service_resumed

    case 'SuspenderAdded':
      return img_events_service_suspended

    case 'SuspenderRemoved':
      return img_events_service_resumed

    default:
      return img_events_default
  }
}

const getMessage = (event: Event, userId?: string): string => {
  switch (event.__typename) {
    case 'BuildStarted':
      return 'Build started'

    case 'BuildEnded':
      return `Build ${
        event.status === 2
          ? 'succeeded'
          : event.status === 3
          ? 'failed'
          : event.status === 4
          ? 'cancelled'
          : 'created'
      }`

    case 'CronJobRunStarted':
      if (event.triggeredByUser) {
        return `Cron job run triggered by ${
          event.triggeredByUser.id === userId
            ? 'you'
            : event.triggeredByUser.name || event.triggeredByUser.email
        }`
      }

      return 'Cron job run started'

    case 'CronJobRunEnded':
      return `Cron job run ${
        event.status === 2
          ? 'succeeded'
          : event.status === 3
          ? 'failed'
          : event.status === 4
          ? 'cancelled'
          : 'created'
      }`

    case 'DeployStarted':
      return 'Deploy started'

    case 'DeployEnded':
      return `Deploy ${
        event.status === 2
          ? 'succeeded'
          : event.status === 3
          ? 'failed'
          : event.status === 4
          ? 'cancelled'
          : 'created'
      }`

    case 'DiskEvent':
      return 'Disk added'

    case 'ServerAvailable':
      return 'Server back up'

    case 'ServerFailed':
      return compact(['Server failed', getReason(event.reason)]).join(': ')

    case 'ServiceSuspended':
      return 'Service suspended'

    case 'ServiceResumed':
      return 'Service resumed'

    case 'SuspenderAdded':
      return `Suspended by ${
        event.suspendedByUser?.id === userId
          ? 'you'
          : event.suspendedByUser?.name || event.suspendedByUser?.email
      }`

    case 'SuspenderRemoved':
      return `Resumed by ${
        event.resumedByUser?.id === userId
          ? 'you'
          : event.resumedByUser?.name || event.resumedByUser?.email
      }`

    default:
      // TODO: report to Sentry

      return 'Unknown event'
  }
}

const getReason = (reason?: IFailureReason | null): string | null => {
  if (reason?.evicted) {
    // TODO: ask Adrian
  }

  if (reason?.nonZeroExit) {
    return `Code ${reason.nonZeroExit}`
  }

  if (reason?.oomKilled) {
    return 'Out of memory'
  }

  if (reason?.timedOutSeconds) {
    return 'Time out'
  }

  return null
}
