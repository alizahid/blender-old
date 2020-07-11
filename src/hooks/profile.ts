import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { useCallback } from 'react'

import {
  IQueryNewPaidServiceAllowedArgs,
  IQueryTeamsForUserArgs,
  IQueryUserArgs,
  IRegion,
  ITeam,
  IUser
} from '../graphql/types'
import { useAuth } from '../store'

const NEW_PAID_SERVICE_ALLOWED = gql`
  query newPaidServiceAllowed($userId: String!) {
    newPaidServiceAllowed(userId: $userId)
  }
`

export const useNewPaidServiceAllowed = () => {
  const [{ user }] = useAuth()

  const { data, loading } = useQuery<
    {
      newPaidServiceAllowed: boolean
    },
    IQueryNewPaidServiceAllowedArgs
  >(NEW_PAID_SERVICE_ALLOWED, {
    variables: {
      userId: String(user)
    }
  })

  return {
    allowed: data?.newPaidServiceAllowed ?? false,
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

const TEAMS = gql`
  query teamsForUser($userId: String!) {
    teamsForUser(userId: $userId) {
      ...teamFields
      __typename
    }
  }

  fragment teamFields on Team {
    id
    name
    email
    __typename
  }
`

export const useProfile = () => {
  const [{ email, user: userId }] = useAuth()

  const user = useQuery<
    {
      user: IUser
    },
    IQueryUserArgs
  >(USER, {
    variables: {
      email
    }
  })

  const teams = useQuery<
    {
      teamsForUser: ITeam[]
    },
    IQueryTeamsForUserArgs
  >(TEAMS, {
    variables: {
      userId: String(userId)
    }
  })

  const refetch = useCallback(() => {
    user.refetch()
    teams.refetch()
  }, [teams, user])

  return {
    loading: user.loading,
    profile: user?.data?.user,
    refetch,
    teams: teams?.data?.teamsForUser ?? []
  }
}
