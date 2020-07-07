import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import { IQueryServicesForOwnerArgs, IService } from '../graphql/types'
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
