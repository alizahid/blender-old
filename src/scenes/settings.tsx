import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { Button, Refresher } from '../components'
import { Payment, Profile, TwoFactor } from '../components/settings'
import { useProfile } from '../hooks'
import { SettingsParamList } from '../navigators/settings'
import { useAuth } from '../store'
import { colors, layout, shadow } from '../styles'

interface Props {
  navigation: StackNavigationProp<SettingsParamList, 'Settings'>
  route: RouteProp<SettingsParamList, 'Settings'>
}

export const Settings: FunctionComponent<Props> = () => {
  const [, { logout }] = useAuth()

  const { loading, profile, refetch } = useProfile()

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="always"
      refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}>
      {profile && (
        <>
          <Profile user={profile} />
          <Payment user={profile} />
          <TwoFactor user={profile} />
          <Button
            label="Sign out"
            onPress={() => logout()}
            small
            style={styles.signOut}
          />
        </>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingVertical: layout.padding
  },
  signOut: {
    ...shadow,
    alignSelf: 'center',
    backgroundColor: colors.status.red,
    marginVertical: layout.padding
  }
})
