import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import update from 'immutability-helper'
import { cloneDeep, omit } from 'lodash'
import { useCallback, useState } from 'react'

import { client } from '../graphql'
import {
  IEnvGroup,
  IEnvVar,
  IEnvVarInput,
  IMutationCreateEnvGroupArgs,
  IMutationDeleteEnvGroupArgs,
  IMutationUpdateEnvGroupEnvVarsArgs,
  IQueryEnvGroupArgs,
  IQueryEnvGroupNameExistsArgs,
  IQueryEnvGroupsForOwnerArgs,
  IQueryServicesForEnvGroupArgs,
  IService
} from '../graphql/types'
import { dialog } from '../lib'
import { useAuth } from '../store'

const ENV_GROUPS = gql`
  query envGroupsForOwner($ownerId: String!) {
    envGroupsForOwner(ownerId: $ownerId) {
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

export const useEnvGroups = () => {
  const [{ id }] = useAuth()

  const { data, loading, refetch } = useQuery<
    {
      envGroupsForOwner: IEnvGroup[]
    },
    IQueryEnvGroupsForOwnerArgs
  >(ENV_GROUPS, {
    variables: {
      ownerId: String(id)
    }
  })

  return {
    envGroups: data?.envGroupsForOwner ?? [],
    loading,
    refetch
  }
}

const ENV_GROUP = gql`
  query envGroup($id: String!) {
    envGroup(id: $id) {
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

const SERVICES_FOR_ENV_GROUP = gql`
  query servicesForEnvGroup($envGroupId: String!) {
    servicesForEnvGroup(envGroupId: $envGroupId) {
      id
      type
      userFacingType
      userFacingTypeSlug
      name
      slug
      sourceBranch
      env {
        ...envFields
        __typename
      }
      repo {
        ...repoFields
        __typename
      }
      updatedAt
      user {
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

export const useEnvGroup = (id: string) => {
  const envGroup = useQuery<
    {
      envGroup: IEnvGroup
    },
    IQueryEnvGroupArgs
  >(ENV_GROUP, {
    variables: {
      id
    }
  })

  const services = useQuery<
    {
      servicesForEnvGroup: IService[]
    },
    IQueryServicesForEnvGroupArgs
  >(SERVICES_FOR_ENV_GROUP, {
    variables: {
      envGroupId: id
    }
  })

  const refetch = useCallback(() => {
    envGroup.refetch()
    services.refetch()
  }, [envGroup, services])

  return {
    envGroup: envGroup.data?.envGroup,
    loading: envGroup.loading || services.loading,
    refetch,
    services: services.data?.servicesForEnvGroup ?? []
  }
}

const CREATE_ENV_GROUP = gql`
  mutation createEnvGroup(
    $name: String!
    $envVarInputs: [EnvVarInput!]!
    $ownerId: String!
  ) {
    createEnvGroup(
      name: $name
      envVarInputs: $envVarInputs
      ownerId: $ownerId
    ) {
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

const ENV_GROUP_NAME_EXISTS = gql`
  query envGroupNameExists($name: String!) {
    envGroupNameExists(name: $name)
  }
`

export const useCreateEnvGroup = () => {
  const [{ id }] = useAuth()

  const [checking, setChecking] = useState(false)

  const [mutate, { loading }] = useMutation<
    {
      createEnvGroup: IEnvGroup
    },
    IMutationCreateEnvGroupArgs
  >(CREATE_ENV_GROUP, {
    update(proxy, response) {
      if (!response.data) {
        return
      }

      const options = {
        query: ENV_GROUPS,
        variables: {
          ownerId: id
        }
      }

      const data = proxy.readQuery<{
        envGroupsForOwner: IEnvGroup[]
      }>(options)

      if (!data) {
        return
      }

      proxy.writeQuery({
        ...options,
        data: update(data, {
          envGroupsForOwner: {
            $unshift: [response.data.createEnvGroup]
          }
        })
      })
    }
  })

  const create = useCallback(
    async (name: string) => {
      setChecking(true)

      const {
        data: { envGroupNameExists }
      } = await client.query<
        {
          envGroupNameExists: boolean
        },
        IQueryEnvGroupNameExistsArgs
      >({
        query: ENV_GROUP_NAME_EXISTS,
        variables: {
          name,
          ownerId: String(id)
        }
      })

      setChecking(false)

      if (envGroupNameExists) {
        dialog.alert({
          message: 'Env group name already exists',
          title: 'Error'
        })

        return
      }

      return mutate({
        variables: {
          envVarInputs: [],
          name,
          ownerId: String(id)
        }
      })
    },
    [id, mutate]
  )

  return {
    create,
    loading: loading || checking
  }
}

const DELETE_ENV_GROUP = gql`
  mutation deleteEnvGroup($id: String!) {
    deleteEnvGroup(id: $id)
  }
`

export const useDeleteEnvGroup = () => {
  const [{ id: ownerId }] = useAuth()

  const [mutate, { loading }] = useMutation<
    {
      deleteEnvGroup: boolean
    },
    IMutationDeleteEnvGroupArgs
  >(DELETE_ENV_GROUP)

  const remove = useCallback(
    async (id: string) => {
      const yes = await dialog.confirm({
        message: 'Are you sure you want to delete this env group?',
        title: 'Delete env group'
      })

      if (!yes) {
        return
      }

      return mutate({
        update(proxy, response) {
          if (!response.data) {
            return
          }

          const options = {
            query: ENV_GROUPS,
            variables: {
              ownerId
            }
          }

          const data = proxy.readQuery<{
            envGroupsForOwner: IEnvGroup[]
          }>(options)

          if (!data) {
            return
          }

          const index = data.envGroupsForOwner.findIndex(
            (envGroup) => envGroup.id === id
          )

          proxy.writeQuery({
            ...options,
            data: update(data, {
              envGroupsForOwner: {
                $splice: [[index, 1]]
              }
            })
          })
        },
        variables: {
          id
        }
      })
    },
    [mutate, ownerId]
  )

  return {
    loading,
    remove
  }
}

const UPDATE_ENV_GROUP_ENV_VARS = gql`
  mutation updateEnvGroupEnvVars($id: String!, $envVarInputs: [EnvVarInput!]!) {
    updateEnvGroupEnvVars(id: $id, envVarInputs: $envVarInputs) {
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

export const useUpdateEnvGroupEnvVars = () => {
  const [mutate, { loading }] = useMutation<
    {
      updateEnvGroupEnvVars: IEnvVar[]
    },
    IMutationUpdateEnvGroupEnvVarsArgs
  >(UPDATE_ENV_GROUP_ENV_VARS)

  const createEnvVar = useCallback(
    (envGroup: IEnvGroup, data: IEnvVarInput) => {
      const envVarInputs = cloneDeep([
        ...envGroup.envVars.filter(({ id }) => id !== data.id),
        data
      ]).map((envVar) => omit(envVar, '__typename'))

      return mutate({
        update(proxy, response) {
          if (!response.data) {
            return
          }

          const options = {
            query: ENV_GROUP,
            variables: {
              id: envGroup.id
            }
          }

          const data = proxy.readQuery<
            {
              envGroup: IEnvGroup
            },
            IQueryEnvGroupArgs
          >(options)

          if (!data) {
            return
          }

          proxy.writeQuery({
            ...options,
            data: update(data, {
              envGroup: {
                envVars: {
                  $set: [
                    ...data.envGroup.envVars.filter(({ isFile }) => isFile),
                    ...response.data.updateEnvGroupEnvVars
                  ]
                }
              }
            })
          })
        },
        variables: {
          envVarInputs,
          id: envGroup.id
        }
      })
    },
    [mutate]
  )

  const updateEnvVars = useCallback(
    (envGroup: IEnvGroup, data: IEnvVarInput) => {
      const envVarInputs = cloneDeep([
        ...envGroup.envVars.filter(({ id }) => id !== data.id),
        data
      ]).map((envVar) => omit(envVar, '__typename'))

      return mutate({
        variables: {
          envVarInputs,
          id: envGroup.id
        }
      })
    },
    [mutate]
  )

  const removeEnvVar = useCallback(
    async (envGroup: IEnvGroup, id: string) => {
      const yes = await dialog.confirm({
        message: 'Are you sure you want to delete this env var?',
        title: 'Delete env var'
      })

      if (!yes) {
        return
      }

      const envVarInputs = cloneDeep(envGroup)
        .envVars.filter((envVar) => !envVar.isFile && envVar.id !== id)
        .map((envVar) => omit(envVar, '__typename'))

      return mutate({
        update(proxy) {
          const options = {
            query: ENV_GROUP,
            variables: {
              id: envGroup.id
            }
          }

          const data = proxy.readQuery<
            {
              envGroup: IEnvGroup
            },
            IQueryEnvGroupArgs
          >(options)

          if (!data) {
            return
          }

          const index = data.envGroup.envVars.findIndex(
            (envVar) => envVar.id === id
          )

          proxy.writeQuery({
            ...options,
            data: update(data, {
              envGroup: {
                envVars: {
                  $splice: [[index, 1]]
                }
              }
            })
          })
        },
        variables: {
          envVarInputs,
          id: envGroup.id
        }
      })
    },
    [mutate]
  )

  return {
    createEnvVar,
    loading,
    removeEnvVar,
    updateEnvVars
  }
}

const UPDATE_ENV_GROUP_SECRET_FILES = gql`
  mutation updateEnvGroupSecretFiles(
    $id: String!
    $envVarInputs: [EnvVarInput!]!
  ) {
    updateEnvGroupSecretFiles(id: $id, fileInputs: $envVarInputs) {
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

export const useUpdateEnvGroupSecretFiles = () => {
  const [mutate, { loading }] = useMutation<
    {
      updateEnvGroupSecretFiles: IEnvVar[]
    },
    IMutationUpdateEnvGroupEnvVarsArgs
  >(UPDATE_ENV_GROUP_SECRET_FILES)

  const createSecretFile = useCallback(
    (envGroup: IEnvGroup, data: IEnvVarInput) => {
      const envVarInputs = cloneDeep([
        ...envGroup.envVars.filter(({ id }) => id !== data.id),
        data
      ]).map((envVar) => omit(envVar, '__typename'))

      return mutate({
        update(proxy, response) {
          if (!response.data) {
            return
          }

          const options = {
            query: ENV_GROUP,
            variables: {
              id: envGroup.id
            }
          }

          const data = proxy.readQuery<
            {
              envGroup: IEnvGroup
            },
            IQueryEnvGroupArgs
          >(options)

          if (!data) {
            return
          }

          proxy.writeQuery({
            ...options,
            data: update(data, {
              envGroup: {
                envVars: {
                  $set: [
                    ...data.envGroup.envVars.filter(({ isFile }) => !isFile),
                    ...response.data.updateEnvGroupSecretFiles
                  ]
                }
              }
            })
          })
        },
        variables: {
          envVarInputs,
          id: envGroup.id
        }
      })
    },
    [mutate]
  )

  const updateSecretFiles = useCallback(
    (envGroup: IEnvGroup, data: IEnvVarInput) => {
      const envVarInputs = cloneDeep([
        ...envGroup.envVars.filter(({ id }) => id !== data.id),
        data
      ]).map((envVar) => omit(envVar, '__typename'))

      return mutate({
        variables: {
          envVarInputs,
          id: envGroup.id
        }
      })
    },
    [mutate]
  )

  const removeSecretFile = useCallback(
    async (envGroup: IEnvGroup, id: string) => {
      const yes = await dialog.confirm({
        message: 'Are you sure you want to delete this secret file?',
        title: 'Delete secret file'
      })

      if (!yes) {
        return
      }

      const envVarInputs = cloneDeep(envGroup)
        .envVars.filter((envVar) => envVar.isFile && envVar.id !== id)
        .map((envVar) => omit(envVar, '__typename'))

      return mutate({
        update(proxy) {
          const options = {
            query: ENV_GROUP,
            variables: {
              id: envGroup.id
            }
          }

          const data = proxy.readQuery<
            {
              envGroup: IEnvGroup
            },
            IQueryEnvGroupArgs
          >(options)

          if (!data) {
            return
          }

          const index = data.envGroup.envVars.findIndex(
            (envVar) => envVar.id === id
          )

          proxy.writeQuery({
            ...options,
            data: update(data, {
              envGroup: {
                envVars: {
                  $splice: [[index, 1]]
                }
              }
            })
          })
        },
        variables: {
          envVarInputs,
          id: envGroup.id
        }
      })
    },
    [mutate]
  )

  return {
    createSecretFile,
    loading,
    removeSecretFile,
    updateSecretFiles
  }
}
