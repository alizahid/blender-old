import AsyncStorage from '@react-native-community/async-storage'
import ApolloClient, {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-boost'
import { API_URI } from 'react-native-dotenv'

import { mitter } from '../lib'
import schema from './schema.json'

export const client = new ApolloClient({
  cache: new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData: schema
    })
  }),
  onError(error) {
    if (error.response?.errors?.[0].extensions?.code === 401) {
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
