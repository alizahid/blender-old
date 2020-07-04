import AsyncStorage from '@react-native-community/async-storage'
import ApolloClient, {
  InMemoryCache,
  IntrospectionFragmentMatcher
} from 'apollo-boost'
import { API_URI } from 'react-native-dotenv'

import schema from './schema.json'

export const client = new ApolloClient({
  cache: new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData: schema
    })
  }),
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
