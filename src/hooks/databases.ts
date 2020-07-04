import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import update from 'immutability-helper'
import { useCallback } from 'react'

import {
  IDatabase,
  IDatabaseInput,
  IMutationCreateDatabaseArgs,
  IPlanData,
  IQueryDatabaseArgs,
  IQueryDatabasesForOwnerArgs
} from '../graphql/types'
import { dialog } from '../lib'
import { useAuth } from '../store'

const DATABASES = gql`
  query databasesForOwner($ownerId: String!) {
    databasesForOwner(ownerId: $ownerId) {
      id
      name
      type
      status
      pendingMaintenanceBy
      __typename
    }
  }
`

export const useDatabases = () => {
  const [{ id }] = useAuth()

  const { data, loading, refetch } = useQuery<
    {
      databasesForOwner: IDatabase[]
    },
    IQueryDatabasesForOwnerArgs
  >(DATABASES, {
    variables: {
      ownerId: String(id)
    }
  })

  return {
    databases: data?.databasesForOwner ?? [],
    loading,
    refetch
  }
}

const DATABASE = gql`
  query database($id: String!) {
    database(id: $id) {
      ...databaseFields
      password
      storageUsedPercent
      storageTotal
      __typename
    }
  }

  fragment databaseFields on Database {
    id
    canBill
    createdAt
    databaseName
    databaseUser
    isMaxPlan
    name
    plan
    region {
      description
    }
    status
    type
    pendingMaintenanceBy
    maintenanceScheduledAt
    __typename
  }
`

const DATABASE_BACKUPS = gql`
  query databaseBackupsQuery($databaseId: String!) {
    database(id: $databaseId) {
      id
      backups {
        edges {
          node {
            id
            createdAt
            baseUrl
            sqlUrl
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }
`

export const useDatabase = (id: string) => {
  const database = useQuery<
    {
      database: IDatabase
    },
    IQueryDatabaseArgs
  >(DATABASE, {
    variables: {
      id
    }
  })

  const backups = useQuery<{
    database: IDatabase
  }>(DATABASE_BACKUPS, {
    variables: {
      databaseId: id
    }
  })

  const refetch = useCallback(() => {
    database.refetch()
    backups.refetch()
  }, [backups, database])

  return {
    backups: backups.data?.database.backups?.edges ?? [],
    database: database.data?.database,
    loading: database.loading || backups.loading,
    refetch
  }
}

const CREATE_DATABASE = gql`
  mutation createDatabase($database: DatabaseInput!) {
    createDatabase(database: $database) {
      ...databaseFields
      __typename
    }
  }

  fragment databaseFields on Database {
    id
    canBill
    createdAt
    databaseName
    databaseUser
    isMaxPlan
    name
    plan
    status
    type
    pendingMaintenanceBy
    maintenanceScheduledAt
    __typename
  }
`

export const useCreateDatabase = () => {
  const [{ id }] = useAuth()

  const [mutate, { loading }] = useMutation<
    {
      createDatabase: IDatabase
    },
    IMutationCreateDatabaseArgs
  >(CREATE_DATABASE, {
    update(proxy, response) {
      if (!response.data) {
        return
      }

      const options = {
        query: DATABASES,
        variables: {
          ownerId: id
        }
      }

      const data = proxy.readQuery<{
        databasesForOwner: IDatabase[]
      }>(options)

      if (!data) {
        return
      }

      proxy.writeQuery({
        ...options,
        data: update(data, {
          databasesForOwner: {
            $push: [response.data.createDatabase]
          }
        })
      })
    }
  })

  const create = useCallback(
    (database: IDatabaseInput) =>
      mutate({
        variables: {
          database
        }
      }),
    [mutate]
  )

  return {
    create,
    loading
  }
}

const DELETE_DATABASE = gql`
  mutation deleteDatabase($id: String!) {
    deleteDatabase(id: $id)
  }
`

export const useDeleteDatabase = () => {
  const [{ id: ownerId }] = useAuth()

  const [mutate, { loading }] = useMutation<{
    deleteDatabase: boolean
  }>(DELETE_DATABASE)

  const remove = useCallback(
    async (id: string) => {
      const yes = await dialog.confirm(
        'Delete database',
        'Are you sure you want to delete this database?'
      )

      if (yes) {
        mutate({
          update(proxy, response) {
            if (!response.data) {
              return
            }

            const options = {
              query: DATABASES,
              variables: {
                ownerId
              }
            }

            const data = proxy.readQuery<{
              databasesForOwner: IDatabase[]
            }>(options)

            if (!data) {
              return
            }

            const index = data.databasesForOwner.findIndex(
              (database) => database.id === id
            )

            proxy.writeQuery({
              ...options,
              data: update(data, {
                databasesForOwner: {
                  $splice: [[index, 1]]
                }
              })
            })
          },
          variables: {
            id
          }
        })
      }
    },
    [mutate, ownerId]
  )

  return {
    loading,
    remove
  }
}

const PLANS = gql`
  query databasePlans {
    databasePlans {
      ...planFields
      __typename
    }
  }

  fragment planFields on PlanData {
    id
    name
    price
    mem
    cpu
    size
    needsPaymentInfo
    __typename
  }
`

export const useDatabasePlans = () => {
  const { data, loading } = useQuery<{
    databasePlans: IPlanData[]
  }>(PLANS)

  return {
    loading,
    plans: data?.databasePlans ?? []
  }
}
