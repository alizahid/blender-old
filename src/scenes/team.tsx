import React, { FunctionComponent } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { Button, Refresher, Separator } from '../components'
import { Members, Payment, Profile, Teams } from '../components/settings'
import { useProfile, useTeam, useTeamMembers } from '../hooks'
import { useAuth } from '../store'
import { colors, layout } from '../styles'

export const Team: FunctionComponent = () => {
  const [, { logout }] = useAuth()

  const {
    loading: loadingProfile,
    profile,
    refetch: refetchProfile,
    teams
  } = useProfile()

  const {
    billing,
    loading: loadingTeam,
    refetch: refetchTeam,
    team
  } = useTeam()

  const { add, adding, remove, removing, revoke, revoking } = useTeamMembers()

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      refreshControl={
        <Refresher
          onRefresh={() => {
            refetchProfile()
            refetchTeam()
          }}
          refreshing={loadingProfile || loadingTeam}
        />
      }>
      {billing && profile && team && (
        <>
          <Profile user={team} />
          <Separator />
          <Payment user={billing} />
          <Separator />
          <Members
            adding={adding}
            onAdd={(email) => add(email)}
            onRemove={(id) => remove(id)}
            onRevoke={(email) => revoke(email)}
            removing={removing || revoking}
            team={team}
          />
          <Separator />
          <Teams teams={teams} user={profile} />
          <Separator />
        </>
      )}
      <Button
        label="Sign out"
        onPress={() => logout()}
        small
        style={styles.signOut}
      />
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
