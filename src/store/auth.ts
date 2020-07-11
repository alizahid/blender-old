import AsyncStorage from '@react-native-community/async-storage'
import { createHook, createStore, StoreActionApi } from 'react-sweet-state'

import { client } from '../graphql'

type State = {
  email?: string
  loading: boolean
  loggedIn: boolean
  team?: string
  user?: string
}
type StoreApi = StoreActionApi<State>
type Actions = typeof actions

const initialState: State = {
  loading: true,
  loggedIn: false
}

const actions = {
  changeTeam: (team?: string) => async ({ setState }: StoreApi) => {
    if (team) {
      await AsyncStorage.setItem('@team', team)
    } else {
      await AsyncStorage.removeItem('@team')
    }

    setState({
      team
    })
  },
  init: () => async ({ setState }: StoreApi) => {
    const [
      [, token],
      [, email],
      [, user],
      [, team]
    ] = await AsyncStorage.multiGet(['@token', '@email', '@user', '@team'])

    if (token && email && user) {
      setState({
        email,
        loggedIn: true,
        team: team || undefined,
        user
      })
    }

    setState({
      loading: false
    })
  },
  login: (token: string, user: string, email: string) => async ({
    setState
  }: StoreApi) => {
    await AsyncStorage.multiSet([
      ['@token', token],
      ['@email', email],
      ['@user', user]
    ])

    setState({
      email,
      loggedIn: true,
      user
    })
  },
  logout: () => async ({ setState }: StoreApi) => {
    await AsyncStorage.multiRemove(['@token', '@email', '@user', '@team'])

    await client.clearStore()

    setState({
      ...initialState,
      loading: false
    })
  }
}

const Store = createStore<State, Actions>({
  actions,
  initialState,
  name: 'auth'
})

export const useAuth = createHook(Store)
