import { useMutation, useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import update from 'immutability-helper'
import { useCallback } from 'react'

import { client } from '../graphql'
import {
  IMutationAddUserToTeamArgs,
  IMutationInviteToTeamArgs,
  IMutationRemovePendingUserFromTeamArgs,
  IMutationRemoveUserFromTeamArgs,
  IOwner,
  IPendingUser,
  IQueryNewPaidServiceAllowedArgs,
  IQueryOwnerArgs,
  IQueryTeamsForUserArgs,
  IQueryUserArgs,
  IRegion,
  ITeam,
  IUser
} from '../graphql/types'
import { dialog } from '../lib'
import { useAuth } from '../store'

const NEW_PAID_SERVICE_ALLOWED = gql`
  query newPaidServiceAllowed($userId: String!) {
    newPaidServiceAllowed(userId: $userId)
  }
`

export const useNewPaidServiceAllowed = () => {
  const [{ team, user }] = useAuth()

  const { data, loading } = useQuery<
    {
      newPaidServiceAllowed: boolean
    },
    IQueryNewPaidServiceAllowedArgs
  >(NEW_PAID_SERVICE_ALLOWED, {
    variables: {
      userId: String(team ?? user)
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

export const FIND_USER = gql`
  query user($email: String!) {
    user(email: $email) {
      id
      email
      __typename
    }
  }
`

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

const TEAM = gql`
  query team($id: String!) {
    team(teamId: $id) {
      ...teamFields
      __typename
    }
  }

  fragment teamFields on Team {
    id
    name
    email
    users {
      ... on User {
        id
        email
        __typename
      }
      __typename
    }
    pendingUsers {
      ... on PendingUser {
        email
        __typename
      }
      __typename
    }
    __typename
  }
`

const BILLING = gql`
  query ownerBilling($ownerId: String!) {
    owner(ownerId: $ownerId) {
      ...ownerFields
      ...ownerBillingFields
      __typename
    }
  }

  fragment ownerBillingFields on Owner {
    cardBrand
    cardLast4
    balance
    __typename
  }

  fragment ownerFields on Owner {
    id
    canBill
    email
    notifyOnFail
    slackConnected
    billingInfo {
      name
      address
      city
      region
      postalCode
      country
      vatNumber
      __typename
    }
    __typename
  }
`

export const useTeam = () => {
  const [{ team: teamId }] = useAuth()

  const team = useQuery<{
    team: ITeam
  }>(TEAM, {
    variables: {
      id: teamId
    }
  })

  const billing = useQuery<
    {
      owner: IOwner
    },
    IQueryOwnerArgs
  >(BILLING, {
    variables: {
      ownerId: String(teamId)
    }
  })

  const refetch = useCallback(() => {
    team.refetch()
    billing.refetch()
  }, [billing, team])

  return {
    billing: billing.data?.owner,
    loading: team.loading || billing.loading,
    refetch,
    team: team?.data?.team
  }
}

const ADD_MEMBER = gql`
  mutation addUserToTeam($teamId: String!, $userId: String!) {
    addUserToTeam(teamId: $teamId, userId: $userId) {
      ... on User {
        id
        email
        __typename
      }
      __typename
    }
  }
`

const INVITE_MEMBER = gql`
  mutation inviteToTeam($email: String!, $teamId: String!) {
    inviteToTeam(email: $email, teamId: $teamId) {
      email
      __typename
    }
  }
`

const REMOVE_MEMBER = gql`
  mutation removeUserFromTeam($teamId: String!, $userId: String!) {
    removeUserFromTeam(teamId: $teamId, userId: $userId)
  }
`

const REMOVE_PENDING_MEMBER = gql`
  mutation removePendingUserFromTeam($teamId: String!, $email: String!) {
    removePendingUserFromTeam(teamId: $teamId, email: $email)
  }
`

export const useTeamMembers = () => {
  const [{ team }] = useAuth()

  const [addMember, addMutation] = useMutation<
    {
      addUserToTeam: IUser
    },
    IMutationAddUserToTeamArgs
  >(ADD_MEMBER)

  const [inviteMember, inviteMutation] = useMutation<
    {
      inviteToTeam: IPendingUser
    },
    IMutationInviteToTeamArgs
  >(INVITE_MEMBER)

  const [removeMember, removeMutation] = useMutation<
    {
      removeUserFromTeam: boolean
    },
    IMutationRemoveUserFromTeamArgs
  >(REMOVE_MEMBER)

  const [revokeMember, revokeMutation] = useMutation<
    {
      removePendingUserFromTeam: boolean
    },
    IMutationRemovePendingUserFromTeamArgs
  >(REMOVE_PENDING_MEMBER)

  const add = useCallback(
    async (email: string) => {
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
        await addMember({
          update(proxy, response) {
            if (!response.data) {
              return
            }

            const options = {
              query: TEAM,
              variables: {
                id: team
              }
            }

            const data = proxy.readQuery<{
              team: ITeam
            }>(options)

            if (!data) {
              return
            }

            proxy.writeQuery({
              ...options,
              data: update(data, {
                team: {
                  users: {
                    $push: [response.data.addUserToTeam]
                  }
                }
              })
            })
          },
          variables: {
            teamId: String(team),
            userId: user.id
          }
        })
      } else {
        await inviteMember({
          update(proxy, response) {
            if (!response.data) {
              return
            }

            const options = {
              query: TEAM,
              variables: {
                id: team
              }
            }

            const data = proxy.readQuery<{
              team: ITeam
            }>(options)

            if (!data) {
              return
            }

            proxy.writeQuery({
              ...options,
              data: update(data, {
                team: {
                  pendingUsers: {
                    $push: [response.data.inviteToTeam]
                  }
                }
              })
            })
          },
          variables: {
            email,
            teamId: String(team)
          }
        })
      }
    },
    [addMember, inviteMember, team]
  )

  const remove = useCallback(
    async (id: string) => {
      if (!team) {
        return
      }

      const yes = await dialog.confirm({
        message: 'Are you sure you want to remove this member?',
        title: 'Remove member'
      })

      if (!yes) {
        return
      }

      return removeMember({
        update(proxy) {
          const options = {
            query: TEAM,
            variables: {
              id: team
            }
          }

          const data = proxy.readQuery<{
            team: ITeam
          }>(options)

          if (!data) {
            return
          }

          const index = data.team.users.findIndex((user) => user.id === id)

          proxy.writeQuery({
            ...options,
            data: update(data, {
              team: {
                users: {
                  $splice: [[index, 1]]
                }
              }
            })
          })
        },
        variables: {
          teamId: team,
          userId: id
        }
      })
    },
    [removeMember, team]
  )

  const revoke = useCallback(
    async (email: string) => {
      if (!team) {
        return
      }

      const yes = await dialog.confirm({
        message: 'Are you sure you want to revoke this invite?',
        title: 'Revoke invite'
      })

      if (!yes) {
        return
      }

      return revokeMember({
        update(proxy) {
          const options = {
            query: TEAM,
            variables: {
              id: team
            }
          }

          const data = proxy.readQuery<{
            team: ITeam
          }>(options)

          if (!data) {
            return
          }

          const index = data.team.pendingUsers.findIndex(
            (user) => user.email === email
          )

          proxy.writeQuery({
            ...options,
            data: update(data, {
              team: {
                pendingUsers: {
                  $splice: [[index, 1]]
                }
              }
            })
          })
        },
        variables: {
          email,
          teamId: team
        }
      })
    },
    [revokeMember, team]
  )

  return {
    add,
    adding: addMutation.loading || inviteMutation.loading,
    remove,
    removing: removeMutation.loading,
    revoke,
    revoking: revokeMutation.loading
  }
}
