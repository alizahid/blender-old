import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import {
  IDatabase,
  IQueryDatabaseArgs,
  IQueryDatabasesForOwnerArgs
} from '../graphql/types'
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

  const refetch = () => {
    database.refetch()
    backups.refetch()
  }

  return {
    backups: backups.data?.database.backups?.edges ?? [],
    database: database.data?.database,
    loading: database.loading || backups.loading,
    refetch
  }
}
