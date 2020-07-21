import AsyncStorage from '@react-native-community/async-storage'
import ApolloClient, {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-boost'
import { API_URI } from 'react-native-dotenv'

import { mitter, sentry } from '../lib'
import schema from './schema.json'

export const client = new ApolloClient({
  cache: new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData: schema
    })
  }),
  onError({ graphQLErrors, networkError, response }) {
    if (networkError) {
      sentry.captureException(networkError)
    }

    if (graphQLErrors) {
      graphQLErrors.forEach((error) => sentry.captureException(error))
    }

    if (response?.errors?.[0].extensions?.code === 401) {
      mitter.emit('logout')
    }
  },
  async request(operation) {
    const token = await AsyncStorage.getItem('@token')

    if (token) {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
  },
  uri: API_URI
})
