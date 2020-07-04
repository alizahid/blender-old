import AsyncStorage from '@react-native-community/async-storage'
import { createHook, createStore, StoreActionApi } from 'react-sweet-state'

type State = {
  loading: boolean
  loggedIn: boolean
  email?: string
  id?: string
}
type StoreApi = StoreActionApi<State>
type Actions = typeof actions

const initialState: State = {
  loading: true,
  loggedIn: false
}

const actions = {
  init: () => async ({ setState }: StoreApi) => {
    const [[, token], [, email], [, id]] = await AsyncStorage.multiGet([
      '@token',
      '@email',
      '@id'
    ])

    if (token && email && id) {
      setState({
        email,
        id,
        loggedIn: true
      })
    }

    setState({
      loading: false
    })
  },
  login: (token: string, id: string, email: string) => async ({
    setState
  }: StoreApi) => {
    await AsyncStorage.multiSet([
      ['@token', token],
      ['@email', email],
      ['@id', id]
    ])

    setState({
      email,
      id,
      loggedIn: true
    })
  },
  logout: () => async ({ setState }: StoreApi) => {
    await AsyncStorage.multiRemove(['@token', '@email', '@id'])

    setState({
      email: undefined,
      id: undefined,
      loggedIn: false
    })
  }
}

const Store = createStore<State, Actions>({
  actions,
  initialState,
  name: 'auth'
})

export const useAuth = createHook(Store)
