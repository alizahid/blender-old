import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import { IQueryNewPaidServiceAllowedArgs, IRegion } from '../graphql/types'
import { useAuth } from '../store'

const NEW_PAID_SERVICE_ALLOWED = gql`
  query newPaidServiceAllowed($userId: String!) {
    newPaidServiceAllowed(userId: $userId)
  }
`

export const useNewPaidServiceAllowed = () => {
  const [{ id }] = useAuth()

  const { data, loading } = useQuery<
    {
      newPaidServiceAllowed: boolean
    },
    IQueryNewPaidServiceAllowedArgs
  >(NEW_PAID_SERVICE_ALLOWED, {
    variables: {
      userId: String(id)
    }
  })

  return {
    allowed: data?.newPaidServiceAllowed,
    loading
  }
}

const ALL_REGIONS = gql`
  query allRegions {
    allRegions {
      id
      description
      __typename
    }
  }
`

export const useAllRegions = () => {
  const { data, loading } = useQuery<{
    allRegions: IRegion[]
  }>(ALL_REGIONS)

  return {
    loading,
    regions: data?.allRegions ?? []
  }
}
