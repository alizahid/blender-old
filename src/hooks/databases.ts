import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import { IDatabase, IQueryDatabasesForOwnerArgs } from '../graphql/types'
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
    databases: data?.databasesForOwner || [],
    loading,
    refetch
  }
}
