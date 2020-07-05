import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import {
  IQueryNewPaidServiceAllowedArgs,
  IQueryUserArgs,
  IRegion,
  IUser
} from '../graphql/types'
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

const USER = gql`
  query userBilling($email: String!) {
    user(email: $email) {
      ...userFields
      ...userBillingFields
      __typename
    }
  }

  fragment userBillingFields on User {
    cardBrand
    cardLast4
    balance
    __typename
  }

  fragment userFields on User {
    id
    active
    canBill
    createdAt
    email
    featureFlags
    githubId
    gitlabId
    name
    notifyOnFail
    notifyOnPrUpdate
    otpEnabled
    passwordExists
    __typename
  }
`

export const useProfile = () => {
  const [{ email }] = useAuth()

  const { data, loading, refetch } = useQuery<
    {
      user: IUser
    },
    IQueryUserArgs
  >(USER, {
    variables: {
      email
    }
  })

  return {
    loading,
    profile: data?.user,
    refetch
  }
}
