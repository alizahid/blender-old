import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import update from 'immutability-helper'
import { cloneDeep, omit, pick } from 'lodash'
import { useCallback } from 'react'

import { client } from '../graphql'
import {
  IBuild,
  IDiskMetricsArgs,
  IEnvGroup,
  IEnvVar,
  IEnvVarInput,
  IHeader,
  IHeaderInput,
  ILogEntry,
  IMutationAddEnvGroupToServiceArgs,
  IMutationGrantPermissionsArgs,
  IMutationInviteAndShareArgs,
  IMutationRemoveEnvGroupFromServiceArgs,
  IMutationRestoreDiskSnapshotArgs,
  IMutationRevokeAllPermissionsArgs,
  IMutationSaveEnvVarsArgs,
  IMutationSaveHeadersArgs,
  IMutationSaveRedirectRulesArgs,
  IQueryBuildsForCronJobArgs,
  IQueryEnvGroupsForServiceArgs,
  IQueryEnvVarsForServiceArgs,
  IQueryHeadersForServiceArgs,
  IQueryRedirectRulesArgs,
  IQueryServerArgs,
  IQueryServiceEventsArgs,
  IQueryServiceLogsArgs,
  IQueryServiceMetricsArgs,
  IQueryServicesForOwnerArgs,
  IQueryUserArgs,
  IRedirectRule,
  IRedirectRuleInput,
  IServer,
  IService,
  IServiceEventsResult,
  IUser
} from '../graphql/types'
import { dialog } from '../lib'
import { useAuth } from '../store'
import { FIND_USER } from './profile'

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
  const [{ team, user }] = useAuth()

  const { data, loading, refetch } = useQuery<
    {
      servicesForOwner: IService[]
    },
    IQueryServicesForOwnerArgs
  >(SERVICES, {
    variables: {
      ownerId: String(team ?? user)
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
      historyMinutes: 60 * 5,
      serviceId: id,
      step: 60
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
      const yes = await dialog.confirm({
        message: 'Are you sure you want to restore this snapshot?',
        title: 'Restore disk snapshot'
      })

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

const COLLABORATORS = gql`
  query permissionsGrantedForService($serviceId: String!) {
    service(id: $serviceId) {
      id
      user {
        id
        email
        __typename
      }
      referentPermissions {
        subject {
          __typename
          ... on User {
            id
            email
            __typename
          }
        }
        action
        __typename
      }
      pendingPermissions {
        email
        action
        __typename
      }
      __typename
    }
  }
`

export const useServiceCollaborators = (id: string) => {
  const { data, loading, refetch } = useQuery<
    {
      service: IService
    },
    IQueryServiceLogsArgs
  >(COLLABORATORS, {
    variables: {
      serviceId: id
    }
  })

  return {
    collaborators: data?.service.referentPermissions ?? [],
    loading,
    owner: data?.service.user,
    pending: data?.service.pendingPermissions ?? [],
    refetch
  }
}

const ADD_COLLABORATOR = gql`
  mutation grantPermissions($permissions: [PermissionInput!]!) {
    grantPermissions(permissions: $permissions) {
      subject {
        __typename
        ... on User {
          id
          __typename
        }
      }
      action
      __typename
    }
  }
`

const INVITE_AND_SHARE = gql`
  mutation inviteAndShare(
    $email: String!
    $action: String!
    $serviceId: String!
  ) {
    inviteAndShare(email: $email, action: $action, serviceId: $serviceId) {
      email
      action
      __typename
    }
  }
`

export const useAddCollaborator = () => {
  const [mutate, mutation] = useMutation<void, IMutationGrantPermissionsArgs>(
    ADD_COLLABORATOR
  )

  const [invite, inviteMutation] = useMutation<
    void,
    IMutationInviteAndShareArgs
  >(INVITE_AND_SHARE)

  const add = useCallback(
    async (id: string, email: string) => {
      const {
        data: { user }
      } = await client.query<
        {
          user: IUser
        },
        IQueryUserArgs
      >({
        query: FIND_USER,
        variables: {
          email
        }
      })

      if (user) {
        mutate({
          awaitRefetchQueries: true,
          refetchQueries() {
            return [
              {
                query: COLLABORATORS,
                variables: {
                  serviceId: id
                }
              }
            ]
          },
          variables: {
            permissions: [
              {
                action: 'all',
                objectId: id,
                subjectId: user.id
              }
            ]
          }
        })
      }

      invite({
        awaitRefetchQueries: true,
        refetchQueries() {
          return [
            {
              query: COLLABORATORS,
              variables: {
                serviceId: id
              }
            }
          ]
        },
        variables: {
          action: 'all',
          email,
          serviceId: id
        }
      })
    },
    [invite, mutate]
  )

  return {
    add,
    adding: mutation.loading || inviteMutation.loading
  }
}

const REMOVE_COLLABORATOR = gql`
  mutation revokeAllPermissions($subjectId: String!, $objectId: String!) {
    revokeAllPermissions(subjectId: $subjectId, objectId: $objectId)
  }
`

export const useRemoveCollaborator = () => {
  const [mutate, mutation] = useMutation<
    void,
    IMutationRevokeAllPermissionsArgs
  >(REMOVE_COLLABORATOR)

  const remove = useCallback(
    async (id: string, userId: string) => {
      const yes = await dialog.confirm({
        message: 'Are you sure you want to remove this collaborator?',
        title: 'Remove collaborator'
      })

      if (!yes) {
        return
      }

      return mutate({
        awaitRefetchQueries: true,
        refetchQueries() {
          return [
            {
              query: COLLABORATORS,
              variables: {
                serviceId: id
              }
            }
          ]
        },
        variables: {
          objectId: id,
          subjectId: userId
        }
      })
    },
    [mutate]
  )

  return {
    remove,
    removing: mutation.loading
  }
}

const METRICS = gql`
  query serviceMetrics(
    $serviceId: String!
    $historyMinutes: Int!
    $step: Int!
  ) {
    service(id: $serviceId) {
      id
      env {
        id
        language
        name
        __typename
      }
      metrics(historyMinutes: $historyMinutes, step: $step) {
        samples {
          time
          memory
          cpu
          __typename
        }
        __typename
      }
      __typename
    }
  }
`

export const useServiceMetrics = (id: string) => {
  const { data, loading, refetch } = useQuery<
    {
      service: IService
    },
    IQueryServiceMetricsArgs
  >(METRICS, {
    fetchPolicy: 'network-only',
    variables: {
      historyMinutes: 60 * 5,
      serviceId: id,
      step: 60
    }
  })

  return {
    loading,
    metrics: data?.service.metrics.samples ?? [],
    refetch
  }
}

const BANDWIDTH = gql`
  query serverBandwidth($serverId: String!) {
    server(id: $serverId) {
      id
      bandwidthMB {
        totalMB
        points {
          time
          bandwidthMB
          __typename
        }
        __typename
      }
      __typename
    }
  }
`

export const useServerBandwidth = (id: string) => {
  const { data, loading, refetch } = useQuery<
    {
      server: IServer
    },
    IQueryRedirectRulesArgs
  >(BANDWIDTH, {
    variables: {
      serverId: id
    }
  })

  return {
    bandwidth: data?.server.bandwidthMB,
    loading,
    refetch
  }
}

const ENV_VARS_FOR_SERVICE = gql`
  query envVarsForService($serviceId: String!, $isFile: Boolean!) {
    envVarsForService(serviceId: $serviceId, isFile: $isFile) {
      ...envVarFields
      __typename
    }
  }

  fragment envVarFields on EnvVar {
    id
    isFile
    key
    value
    __typename
  }
`

const SAVE_ENV_VARS = gql`
  mutation saveEnvVars($serviceId: String!, $envVarInputs: [EnvVarInput!]!) {
    saveEnvVars(serviceId: $serviceId, envVarInputs: $envVarInputs) {
      ...envVarFields
      __typename
    }
  }

  fragment envVarFields on EnvVar {
    id
    isFile
    key
    value
    __typename
  }
`

const SAVE_SECRET_FILES = gql`
  mutation saveSecretFiles(
    $serviceId: String!
    $envVarInputs: [EnvVarInput!]!
  ) {
    saveSecretFiles(serviceId: $serviceId, fileInputs: $envVarInputs) {
      ...envVarFields
      __typename
    }
  }

  fragment envVarFields on EnvVar {
    id
    isFile
    key
    value
    __typename
  }
`

export const useServiceEnv = (id: string, isFile: boolean) => {
  const { data, loading, refetch } = useQuery<
    {
      envVarsForService: IEnvVar[]
    },
    IQueryEnvVarsForServiceArgs
  >(ENV_VARS_FOR_SERVICE, {
    variables: {
      isFile,
      serviceId: id
    }
  })

  const [saveEnvVars, saveEnvVarsMutation] = useMutation<
    {
      saveEnvVars: IEnvVar[]
    },
    IMutationSaveEnvVarsArgs
  >(SAVE_ENV_VARS)

  const [saveSecretFiles, saveSecretFilesMutation] = useMutation<
    {
      saveSecretFiles: IEnvVar[]
    },
    IMutationSaveEnvVarsArgs
  >(SAVE_SECRET_FILES)

  const createEnvVar = useCallback(
    (input: IEnvVarInput) => {
      if (!data) {
        return
      }

      return saveEnvVars({
        update(proxy, response) {
          if (!response.data) {
            return
          }

          const options = {
            query: ENV_VARS_FOR_SERVICE,
            variables: {
              isFile,
              serviceId: id
            }
          }

          const data = proxy.readQuery<
            {
              envVarsForService: IEnvVar[]
            },
            IQueryEnvVarsForServiceArgs
          >(options)

          if (!data) {
            return
          }

          proxy.writeQuery({
            ...options,
            data: update(data, {
              envVarsForService: {
                $set: response.data.saveEnvVars
              }
            })
          })
        },
        variables: {
          envVarInputs: cloneDeep([
            ...data.envVarsForService.filter(
              (envVar) => envVar.isFile === isFile
            ),
            input
          ]).map((envVar) => omit(envVar, '__typename')),
          serviceId: id
        }
      })
    },
    [data, id, isFile, saveEnvVars]
  )

  const updateEnvVar = useCallback(
    (input: IEnvVarInput) => {
      if (!data) {
        return
      }

      return saveEnvVars({
        variables: {
          envVarInputs: cloneDeep([
            ...data.envVarsForService.filter(
              (envVar) => envVar.id !== input.id && envVar.isFile === isFile
            ),
            input
          ]).map((envVar) => omit(envVar, '__typename')),
          serviceId: id
        }
      })
    },
    [data, id, isFile, saveEnvVars]
  )

  const removeEnvVar = useCallback(
    async (envVarId: string) => {
      if (!data) {
        return
      }

      const yes = await dialog.confirm({
        message: 'Are you sure you want to delete this env var?',
        title: 'Delete env var'
      })

      if (!yes) {
        return
      }

      return saveEnvVars({
        update(proxy) {
          const options = {
            query: ENV_VARS_FOR_SERVICE,
            variables: {
              isFile,
              serviceId: id
            }
          }

          const data = proxy.readQuery<
            {
              envVarsForService: IEnvVar[]
            },
            IQueryEnvVarsForServiceArgs
          >(options)

          if (!data) {
            return
          }

          const index = data.envVarsForService.findIndex(
            ({ id }) => id === envVarId
          )

          proxy.writeQuery({
            ...options,
            data: update(data, {
              envVarsForService: {
                $splice: [[index, 1]]
              }
            })
          })
        },
        variables: {
          envVarInputs: cloneDeep(
            data.envVarsForService.filter(
              (envVar) => envVar.id !== envVarId && envVar.isFile === isFile
            )
          ).map((envVar) => omit(envVar, '__typename')),
          serviceId: id
        }
      })
    },
    [data, id, isFile, saveEnvVars]
  )

  const createSecretFile = useCallback(
    (input: IEnvVarInput) => {
      if (!data) {
        return
      }

      return saveSecretFiles({
        update(proxy, response) {
          if (!response.data) {
            return
          }

          const options = {
            query: ENV_VARS_FOR_SERVICE,
            variables: {
              isFile,
              serviceId: id
            }
          }

          const data = proxy.readQuery<
            {
              envVarsForService: IEnvVar[]
            },
            IQueryEnvVarsForServiceArgs
          >(options)

          if (!data) {
            return
          }

          proxy.writeQuery({
            ...options,
            data: update(data, {
              envVarsForService: {
                $set: response.data.saveSecretFiles
              }
            })
          })
        },
        variables: {
          envVarInputs: cloneDeep([
            ...data.envVarsForService.filter(
              (envVar) => envVar.isFile === isFile
            ),
            input
          ]).map((envVar) => omit(envVar, '__typename')),
          serviceId: id
        }
      })
    },
    [data, id, isFile, saveSecretFiles]
  )

  const updateSecretFile = useCallback(
    (input: IEnvVarInput) => {
      if (!data) {
        return
      }

      return saveSecretFiles({
        variables: {
          envVarInputs: cloneDeep([
            ...data.envVarsForService.filter(
              (envVar) => envVar.id !== input.id && envVar.isFile === isFile
            ),
            input
          ]).map((envVar) => omit(envVar, '__typename')),
          serviceId: id
        }
      })
    },
    [data, id, isFile, saveSecretFiles]
  )

  const removeSecretFile = useCallback(
    async (envVarId: string) => {
      if (!data) {
        return
      }

      const yes = await dialog.confirm({
        message: 'Are you sure you want to delete this secret file?',
        title: 'Delete secret file'
      })

      if (!yes) {
        return
      }

      return saveSecretFiles({
        update(proxy) {
          const options = {
            query: ENV_VARS_FOR_SERVICE,
            variables: {
              isFile,
              serviceId: id
            }
          }

          const data = proxy.readQuery<
            {
              envVarsForService: IEnvVar[]
            },
            IQueryEnvVarsForServiceArgs
          >(options)

          if (!data) {
            return
          }

          const index = data.envVarsForService.findIndex(
            ({ id }) => id === envVarId
          )

          proxy.writeQuery({
            ...options,
            data: update(data, {
              envVarsForService: {
                $splice: [[index, 1]]
              }
            })
          })
        },
        variables: {
          envVarInputs: cloneDeep(
            data.envVarsForService.filter(
              (envVar) => envVar.id !== envVarId && envVar.isFile === isFile
            )
          ).map((envVar) => omit(envVar, '__typename')),
          serviceId: id
        }
      })
    },
    [data, id, isFile, saveSecretFiles]
  )

  return {
    createEnvVar,
    createSecretFile,
    envVars: data?.envVarsForService ?? [],
    loading,
    refetch,
    removeEnvVar,
    removeSecretFile,
    updateEnvVar,
    updateSecretFile,
    updating: saveEnvVarsMutation.loading || saveSecretFilesMutation.loading
  }
}

const ENV_GROUPS_FOR_SERVICE = gql`
  query envGroupsForService($serviceId: String!) {
    envGroupsForService(serviceId: $serviceId) {
      ...envGroupFields
      __typename
    }
  }

  fragment envGroupFields on EnvGroup {
    id
    name
    ownerId
    createdAt
    updatedAt
    envVars {
      ...envVarFields
      __typename
    }
    __typename
  }

  fragment envVarFields on EnvVar {
    id
    isFile
    key
    value
    __typename
  }
`

const ADD_ENV_GROUP_TO_SERVICE = gql`
  mutation addEnvGroupToService($serviceId: String!, $envGroupId: String!) {
    addEnvGroupToService(serviceId: $serviceId, envGroupId: $envGroupId) {
      ...envGroupFields
      __typename
    }
  }

  fragment envGroupFields on EnvGroup {
    id
    name
    ownerId
    createdAt
    updatedAt
    envVars {
      ...envVarFields
      __typename
    }
    __typename
  }

  fragment envVarFields on EnvVar {
    id
    isFile
    key
    value
    __typename
  }
`

const REMOVE_ENV_GROUP_FROM_SERVICE = gql`
  mutation removeEnvGroupFromService(
    $serviceId: String!
    $envGroupId: String!
  ) {
    removeEnvGroupFromService(serviceId: $serviceId, envGroupId: $envGroupId)
  }
`

export const useServiceEnvGroups = (id: string) => {
  const { data, loading, refetch } = useQuery<
    {
      envGroupsForService: IEnvGroup[]
    },
    IQueryEnvGroupsForServiceArgs
  >(ENV_GROUPS_FOR_SERVICE, {
    variables: {
      serviceId: id
    }
  })

  const [add, addMutation] = useMutation<
    {
      addEnvGroupToService: IEnvGroup
    },
    IMutationAddEnvGroupToServiceArgs
  >(ADD_ENV_GROUP_TO_SERVICE, {
    awaitRefetchQueries: true,
    refetchQueries() {
      return [
        {
          query: ENV_GROUPS_FOR_SERVICE,
          variables: {
            serviceId: id
          }
        }
      ]
    }
  })

  const [remove, removeMutation] = useMutation<
    {
      removeEnvGroupFromService: boolean
    },
    IMutationRemoveEnvGroupFromServiceArgs
  >(REMOVE_ENV_GROUP_FROM_SERVICE, {
    awaitRefetchQueries: true,
    refetchQueries() {
      return [
        {
          query: ENV_GROUPS_FOR_SERVICE,
          variables: {
            serviceId: id
          }
        }
      ]
    }
  })

  const link = useCallback(
    async (envGroup: IEnvGroup) => {
      const yes = await dialog.confirm({
        message: 'Are you sure you want to add this env group to this service?',
        title: 'Link env group'
      })

      if (!yes) {
        return
      }

      return add({
        variables: {
          envGroupId: envGroup.id,
          serviceId: id
        }
      })
    },
    [add, id]
  )

  const unlink = useCallback(
    async (envGroup: IEnvGroup) => {
      const yes = await dialog.confirm({
        message:
          'Are you sure you want to remove this env group to this service?',
        title: 'Unlink env group'
      })

      if (!yes) {
        return
      }

      return remove({
        update(proxy) {
          const options = {
            query: ENV_GROUPS_FOR_SERVICE,
            variables: {
              serviceId: id
            }
          }

          const data = proxy.readQuery<
            {
              envGroupsForService: IEnvGroup[]
            },
            IQueryEnvGroupsForServiceArgs
          >(options)

          if (!data) {
            return
          }

          const index = data.envGroupsForService.findIndex(
            ({ id }) => id === envGroup.id
          )

          proxy.writeQuery({
            ...options,
            data: update(data, {
              envGroupsForService: {
                $splice: [[index, 1]]
              }
            })
          })
        },
        variables: {
          envGroupId: envGroup.id,
          serviceId: id
        }
      })
    },
    [id, remove]
  )

  return {
    envGroups: data?.envGroupsForService ?? [],
    link,
    linking: addMutation.loading,
    loading,
    refetch,
    unlink,
    unlinking: removeMutation.loading
  }
}

const REDIRECT_RULES = gql`
  query redirectRules($serverId: String!) {
    redirectRules(serverId: $serverId) {
      ...redirectRuleFields
      __typename
    }
  }

  fragment redirectRuleFields on RedirectRule {
    id
    source
    destination
    enabled
    httpStatus
    serverId
    __typename
  }
`

const SAVE_REDIRECT_RULES = gql`
  mutation saveRedirectRules(
    $serverId: String!
    $rules: [RedirectRuleInput!]!
  ) {
    saveRedirectRules(serverId: $serverId, rules: $rules) {
      ...redirectRuleFields
      __typename
    }
  }

  fragment redirectRuleFields on RedirectRule {
    id
    source
    destination
    enabled
    httpStatus
    serverId
    __typename
  }
`

export const useServiceRedirects = (id: string) => {
  const { data, loading, refetch } = useQuery<
    {
      redirectRules: IRedirectRule[]
    },
    IQueryRedirectRulesArgs
  >(REDIRECT_RULES, {
    variables: {
      serverId: id
    }
  })

  const [mutate, mutation] = useMutation<
    {
      saveRedirectRules: IRedirectRule[]
    },
    IMutationSaveRedirectRulesArgs
  >(SAVE_REDIRECT_RULES, {
    update(proxy, response) {
      if (!response.data) {
        return
      }

      const options = {
        query: REDIRECT_RULES,
        variables: {
          serverId: id
        }
      }

      const data = proxy.readQuery<
        {
          redirectRules: IRedirectRule[]
        },
        IQueryRedirectRulesArgs
      >(options)

      if (!data) {
        return
      }

      proxy.writeQuery({
        ...options,
        data: update(data, {
          redirectRules: {
            $set: response.data.saveRedirectRules
          }
        })
      })
    }
  })

  const createRule = useCallback(
    async (input: IRedirectRuleInput) => {
      if (!data) {
        return
      }

      await mutate({
        variables: {
          rules: cloneDeep([...data.redirectRules, input]).map((rule) =>
            pick(rule, ['source', 'destination', 'httpStatus', 'enabled'])
          ),
          serverId: id
        }
      })
    },
    [data, id, mutate]
  )

  const updateRule = useCallback(
    async (input: IRedirectRuleInput) => {
      if (!data) {
        return
      }

      await mutate({
        variables: {
          rules: cloneDeep([
            ...data.redirectRules.filter(({ id }) => id !== input.id),
            input
          ]).map((rule) =>
            pick(rule, ['source', 'destination', 'httpStatus', 'enabled'])
          ),
          serverId: id
        }
      })
    },
    [data, id, mutate]
  )

  const removeRule = useCallback(
    async (ruleId: string) => {
      if (!data) {
        return
      }

      const yes = await dialog.confirm({
        message: 'Are you sure you want to delete this rule?',
        title: 'Delete rule'
      })

      if (!yes) {
        return
      }

      return mutate({
        variables: {
          rules: cloneDeep(
            data.redirectRules.filter((rule) => rule.id !== ruleId)
          ).map((rule) =>
            pick(rule, ['source', 'destination', 'httpStatus', 'enabled'])
          ),
          serverId: id
        }
      })
    },
    [data, id, mutate]
  )

  const moveRule = useCallback(
    (ruleId: string, direction: 'up' | 'down') => {
      if (!data) {
        return
      }

      const rules = cloneDeep(data.redirectRules)

      const index = rules.findIndex(({ id }) => id === ruleId)

      const rule = rules.splice(index, 1)[0]

      if (direction === 'down') {
        rules.splice(index + 1, 0, rule)
      } else {
        rules.splice(index - 1, 0, rule)
      }

      return mutate({
        optimisticResponse: {
          saveRedirectRules: rules
        },
        variables: {
          rules: rules.map((rule) =>
            pick(rule, ['source', 'destination', 'httpStatus', 'enabled'])
          ),
          serverId: id
        }
      })
    },
    [data, id, mutate]
  )

  return {
    createRule,
    loading,
    moveRule,
    refetch,
    removeRule,
    rules: data?.redirectRules ?? [],
    updateRule,
    updating: mutation.loading
  }
}

const HEADERS = gql`
  query headersForService($serviceId: String!) {
    headersForService(serviceId: $serviceId) {
      ...headerFields
      __typename
    }
  }

  fragment headerFields on Header {
    id
    key
    path
    serviceId
    value
    __typename
  }
`

const SAVE_HEADERS = gql`
  mutation saveHeaders($serviceId: String!, $headerInputs: [HeaderInput!]!) {
    saveHeaders(serviceId: $serviceId, headerInputs: $headerInputs) {
      ...headerFields
      __typename
    }
  }

  fragment headerFields on Header {
    id
    key
    path
    serviceId
    value
    __typename
  }
`

export const useServiceHeaders = (id: string) => {
  const { data, loading, refetch } = useQuery<
    {
      headersForService: IHeader[]
    },
    IQueryHeadersForServiceArgs
  >(HEADERS, {
    variables: {
      serviceId: id
    }
  })

  const [mutate, mutation] = useMutation<
    {
      saveHeaders: IHeader[]
    },
    IMutationSaveHeadersArgs
  >(SAVE_HEADERS, {
    update(proxy, response) {
      if (!response.data) {
        return
      }

      const options = {
        query: HEADERS,
        variables: {
          serviceId: id
        }
      }

      const data = proxy.readQuery<
        {
          headersForService: IHeader[]
        },
        IQueryHeadersForServiceArgs
      >(options)

      if (!data) {
        return
      }

      proxy.writeQuery({
        ...options,
        data: update(data, {
          headersForService: {
            $set: response.data.saveHeaders
          }
        })
      })
    }
  })

  const createHeader = useCallback(
    async (input: IHeaderInput) => {
      if (!data) {
        return
      }

      await mutate({
        variables: {
          headerInputs: cloneDeep([...data.headersForService, input]).map(
            (header) => ({
              ...pick(header, ['path', 'key', 'value']),
              enabled: true
            })
          ),
          serviceId: id
        }
      })
    },
    [data, id, mutate]
  )

  const updateHeader = useCallback(
    async (input: IHeaderInput) => {
      if (!data) {
        return
      }

      await mutate({
        variables: {
          headerInputs: cloneDeep([
            ...data.headersForService.filter(({ id }) => id !== input.id),
            input
          ]).map((header) => ({
            ...pick(header, ['path', 'key', 'value']),
            enabled: true
          })),
          serviceId: id
        }
      })
    },
    [data, id, mutate]
  )

  const removeHeader = useCallback(
    async (headerId: string) => {
      if (!data) {
        return
      }

      const yes = await dialog.confirm({
        message: 'Are you sure you want to delete this header?',
        title: 'Delete header'
      })

      if (!yes) {
        return
      }

      return mutate({
        variables: {
          headerInputs: cloneDeep(
            data.headersForService.filter((header) => header.id !== headerId)
          ).map((header) => ({
            ...pick(header, ['path', 'key', 'value']),
            enabled: true
          })),
          serviceId: id
        }
      })
    },
    [data, id, mutate]
  )

  return {
    createHeader,
    headers: data?.headersForService ?? [],
    loading,
    refetch,
    removeHeader,
    updateHeader,
    updating: mutation.loading
  }
}
