import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { Button, Refresher, Separator } from '../components'
import { Payment, Profile, Teams, TwoFactor } from '../components/settings'
import { useProfile } from '../hooks'
import { SettingsParamList } from '../navigators/settings'
import { useAuth } from '../store'
import { colors, layout } from '../styles'

interface Props {
  navigation: StackNavigationProp<SettingsParamList, 'Settings'>
  route: RouteProp<SettingsParamList, 'Settings'>
}

export const Settings: FunctionComponent<Props> = () => {
  const [, { logout }] = useAuth()

  const { loading, profile, refetch, teams } = useProfile()

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      refreshControl={<Refresher onRefresh={refetch} refreshing={loading} />}>
      {profile && (
        <>
          <Profile user={profile} />
          <Separator />
          <Teams teams={teams} />
          <Separator />
          <Payment user={profile} />
          <Separator />
          <TwoFactor user={profile} />
          <Separator />
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
  signOut: {
    alignSelf: 'center',
    backgroundColor: colors.status.red,
    marginVertical: layout.margin
  }
})
