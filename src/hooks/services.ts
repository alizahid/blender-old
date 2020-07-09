import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { useCallback } from 'react'

import {
  IBuild,
  IDiskMetricsArgs,
  ILogEntry,
  IMutationRestoreDiskSnapshotArgs,
  IQueryBuildsForCronJobArgs,
  IQueryServerArgs,
  IQueryServiceEventsArgs,
  IQueryServiceLogsArgs,
  IQueryServicesForOwnerArgs,
  IServer,
  IService,
  IServiceEventsResult
} from '../graphql/types'
import { dialog } from '../lib'
import { useAuth } from '../store'

const SERVICES = gql`
  query servicesForOwner($ownerId: String!) {
    servicesForOwner(ownerId: $ownerId) {
      id
      type
      userFacingType
      userFacingTypeSlug
      name
      slug
      env {
        ...envFields
        __typename
      }
      repo {
        ...repoFields
        __typename
      }
      updatedAt
      state
      owner {
        id
        __typename
      }
      __typename
    }
  }

  fragment envFields on Env {
    id
    name
    language
    isStatic
    sampleBuildCommand
    sampleStartCommand
    __typename
  }

  fragment repoFields on Repo {
    id
    provider
    providerId
    name
    ownerName
    webURL
    isPrivate
    __typename
  }
`

export const useServices = () => {
  const [{ id }] = useAuth()

  const { data, loading, refetch } = useQuery<
    {
      servicesForOwner: IService[]
    },
    IQueryServicesForOwnerArgs
  >(SERVICES, {
    variables: {
      ownerId: String(id)
    }
  })

  return {
    loading,
    refetch,
    services: data?.servicesForOwner ?? []
  }
}

const SERVER = gql`
  query server($id: String!) {
    server(id: $id) {
      ...serverFields
      verifiedDomains
      __typename
    }
  }

  fragment serverFields on Server {
    ...serviceFields
    canBill
    deletedAt
    deploy {
      ...deployFields
      __typename
    }
    deployKey
    extraInstances
    healthCheckPath
    isPrivate
    isWorker
    openPorts
    parentServer {
      ...serviceFields
      __typename
    }
    plan {
      name
      price
      __typename
    }
    prPreviewsEnabled
    pullRequestId
    startCommand
    staticPublishPath
    suspenders
    url
    disk {
      ...diskFields
      __typename
    }
    __typename
  }

  fragment serviceFields on Service {
    id
    type
    env {
      ...envFields
      __typename
    }
    repo {
      ...repoFields
      __typename
    }
    user {
      id
      email
      __typename
    }
    owner {
      id
      __typename
    }
    name
    slug
    sourceBranch
    buildCommand
    autoDeploy
    notifyOnFail
    userFacingType
    userFacingTypeSlug
    baseDir
    dockerCommand
    dockerfilePath
    createdAt
    updatedAt
    region {
      id
      __typename
    }
    state
    suspenders
    __typename
  }

  fragment envFields on Env {
    id
    name
    language
    isStatic
    sampleBuildCommand
    sampleStartCommand
    __typename
  }

  fragment repoFields on Repo {
    id
    provider
    providerId
    name
    ownerName
    webURL
    isPrivate
    __typename
  }

  fragment deployFields on Deploy {
    id
    status
    buildId
    commitId
    commitShortId
    commitMessage
    commitURL
    commitCreatedAt
    finishedAt
    finishedAtUnixNano
    createdAt
    updatedAt
    rollbackSupportStatus
    __typename
  }

  fragment diskFields on Disk {
    id
    name
    mountPath
    sizeGB
    __typename
  }
`

export const useServer = (id: string) => {
  const { data, loading } = useQuery<
    {
      server: IServer
    },
    IQueryServerArgs
  >(SERVER, {
    variables: {
      id
    }
  })

  return {
    loading,
    server: data?.server
  }
}

const EVENTS = gql`
  query serviceEvents($serviceId: String!, $before: Time, $limit: Int) {
    serviceEvents(serviceId: $serviceId, before: $before, limit: $limit) {
      hasMore
      events {
        ...allServiceEvents
        __typename
      }
      __typename
    }
  }

  fragment allServiceEvents on ServiceEvent {
    ...serviceEventFields
    ...buildEndedFields
    ...buildStartedFields
    ...cronJobRunEndedFields
    ...cronJobRunStartedFields
    ...deployEndedFields
    ...deployStartedFields
    ...serverFailedFields
    ...suspenderAddedFields
    ...suspenderRemovedFields
    ...planChangedFields
    ...extraInstancesChangedFields
    ...branchDeletedFields
    __typename
  }

  fragment serviceEventFields on ServiceEvent {
    id
    timestamp
    __typename
  }

  fragment buildEndedFields on BuildEnded {
    buildId
    build {
      id
      commitShortId
      commitMessage
      commitURL
      __typename
    }
    status
    reason {
      ...buildDeployEndReasonFields
      __typename
    }
    __typename
  }

  fragment buildDeployEndReasonFields on BuildDeployEndReason {
    buildFailed {
      id
      __typename
    }
    newBuild {
      id
      __typename
    }
    newDeploy {
      id
      __typename
    }
    failure {
      ...failureReasonFields
      __typename
    }
    timedOutSeconds
    __typename
  }

  fragment failureReasonFields on FailureReason {
    evicted
    nonZeroExit
    oomKilled {
      memoryRequest
      memoryLimit
      __typename
    }
    timedOutSeconds
    __typename
  }

  fragment buildStartedFields on BuildStarted {
    buildId
    build {
      id
      commitShortId
      commitMessage
      commitURL
      __typename
    }
    trigger {
      ...buildDeployTriggerFields
      __typename
    }
    __typename
  }

  fragment buildDeployTriggerFields on BuildDeployTrigger {
    firstBuild
    clusterSynced
    envUpdated
    manual
    clearCache
    user {
      id
      email
      __typename
    }
    updatedProperty
    newCommit
    system
    rollback
    rollbackTargetDeployID
    __typename
  }

  fragment cronJobRunEndedFields on CronJobRunEnded {
    cronJobRunId
    cronJobRun {
      id
      status
      __typename
    }
    status
    newRun {
      id
      __typename
    }
    reason {
      ...failureReasonFields
      __typename
    }
    user {
      id
      email
      __typename
    }
    __typename
  }

  fragment cronJobRunStartedFields on CronJobRunStarted {
    cronJobRunId
    cronJobRun {
      id
      status
      __typename
    }
    triggeredByUser {
      id
      email
      name
      __typename
    }
    __typename
  }

  fragment deployEndedFields on DeployEnded {
    deployId
    deploy {
      id
      status
      commitShortId
      commitMessage
      commitURL
      rollbackSupportStatus
      __typename
    }
    status
    reason {
      ...buildDeployEndReasonFields
      __typename
    }
    __typename
  }

  fragment deployStartedFields on DeployStarted {
    deployId
    deploy {
      id
      status
      commitShortId
      commitMessage
      commitURL
      rollbackSupportStatus
      __typename
    }
    trigger {
      ...buildDeployTriggerFields
      __typename
    }
    __typename
  }

  fragment serverFailedFields on ServerFailed {
    reason {
      ...failureReasonFields
      __typename
    }
    __typename
  }

  fragment suspenderAddedFields on SuspenderAdded {
    actor
    suspendedByUser {
      id
      email
      name
      __typename
    }
    __typename
  }

  fragment suspenderRemovedFields on SuspenderRemoved {
    actor
    resumedByUser {
      id
      email
      name
      __typename
    }
    __typename
  }

  fragment planChangedFields on PlanChanged {
    from
    to
    __typename
  }

  fragment extraInstancesChangedFields on ExtraInstancesChanged {
    fromInstances
    toInstances
    __typename
  }

  fragment branchDeletedFields on BranchDeleted {
    deletedBranch
    newBranch
    __typename
  }
`

export const useServiceEvents = (id: string) => {
  const { data, loading, refetch } = useQuery<
    {
      serviceEvents: IServiceEventsResult
    },
    IQueryServiceEventsArgs
  >(EVENTS, {
    variables: {
      serviceId: id
    }
  })

  return {
    events: data?.serviceEvents.events ?? [],
    loading,
    refetch
  }
}

const LOGS = gql`
  query serviceLogs($serviceId: String!) {
    serviceLogs(serviceId: $serviceId) {
      ...logEntryFields
      __typename
    }
  }

  fragment logEntryFields on LogEntry {
    id
    serviceId
    buildId
    deployId
    timestamp
    text
    __typename
  }
`

export const useServiceLogs = (id: string) => {
  const { data, loading, refetch } = useQuery<
    {
      serviceLogs: ILogEntry[]
    },
    IQueryServiceLogsArgs
  >(LOGS, {
    variables: {
      serviceId: id
    }
  })

  return {
    loading,
    logs: data?.serviceLogs ?? [],
    refetch
  }
}

const DISK_METRICS = gql`
  query diskMetrics($serviceId: String!, $historyLength: Int, $step: Int) {
    server(id: $serviceId) {
      id
      disk {
        id
        name
        mountPath
        sizeGB
        metrics(historyMinutes: $historyLength, step: $step) {
          time
          availableBytes
          usedBytes
          __typename
        }
        __typename
      }
      __typename
    }
  }
`

const DISK_SNAPSHOTS = gql`
  query diskSnapshots($serverId: String!) {
    server(id: $serverId) {
      id
      disk {
        id
        name
        snapshots {
          createdAt
          snapshotKey
          __typename
        }
        __typename
      }
      __typename
    }
  }
`

export const useServiceDisk = (id: string) => {
  const disk = useQuery<
    {
      server: IServer
    },
    IQueryServiceLogsArgs & IDiskMetricsArgs
  >(DISK_METRICS, {
    variables: {
      historyMinutes: 60,
      serviceId: id,
      step: 60 * 24
    }
  })

  const snapshots = useQuery<{
    server: IServer
  }>(DISK_SNAPSHOTS, {
    variables: {
      serverId: id
    }
  })

  const refetch = useCallback(() => {
    disk.refetch()
    snapshots.refetch()
  }, [disk, snapshots])

  return {
    disk: disk.data?.server.disk,
    loading: disk.loading || snapshots.loading,
    refetch,
    snapshots: snapshots.data?.server.disk?.snapshots ?? []
  }
}

const RESTORE_DISK_SNAPSHOT = gql`
  mutation restoreDiskSnapshot($diskId: String!, $snapshotKey: String!) {
    restoreDiskSnapshot(diskId: $diskId, snapshotKey: $snapshotKey) {
      __typename
    }
  }
`

export const useRestoreDiskSnapshot = () => {
  const [mutate, { loading }] = useMutation<
    void,
    IMutationRestoreDiskSnapshotArgs
  >(RESTORE_DISK_SNAPSHOT)

  const restore = useCallback(
    async (id: string, key: string) => {
      const yes = await dialog.confirm(
        'Restore disk snapshot',
        'Are you sure you want to restore this snapshot?'
      )

      if (!yes) {
        return
      }

      return mutate({
        variables: {
          diskId: id,
          snapshotKey: key
        }
      })
    },
    [mutate]
  )

  return {
    loading,
    restore
  }
}

const BUILDS_FOR_CRON_JOB = gql`
  query buildsForCronJob($cronJobId: String!, $limit: Int!) {
    buildsForCronJob(cronJobId: $cronJobId, limit: $limit) {
      ...buildFields
      __typename
    }
  }

  fragment buildFields on Build {
    id
    status
    commitId
    commitShortId
    commitMessage
    commitURL
    commitCreatedAt
    createdAt
    updatedAt
    __typename
  }
`

export const useBuildsForCronJob = (id: string) => {
  const { data, loading, refetch } = useQuery<
    {
      buildsForCronJob: IBuild[]
    },
    IQueryBuildsForCronJobArgs
  >(BUILDS_FOR_CRON_JOB, {
    variables: {
      cronJobId: id,
      limit: 20
    }
  })

  return {
    builds: data?.buildsForCronJob ?? [],
    loading,
    refetch
  }
}
