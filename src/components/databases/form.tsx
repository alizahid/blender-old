import React, { FunctionComponent, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { IDatabaseInput, IPlanData, IRegion } from '../../graphql/types'
import { colors, layout, typography } from '../../styles'
import { Button } from '../button'
import { Picker } from '../picker'
import { DatabasePlan } from '../plans'
import { Separator } from '../separator'
import { TextBox } from '../text-box'

interface Props {
  plan: IPlanData
  regions: IRegion[]

  onChangePlan: () => void
  onUpdate: (data: Partial<IDatabaseInput>) => void
}

export const Form: FunctionComponent<Props> = ({
  onChangePlan,
  onUpdate,
  plan,
  regions
}) => {
  const [name, setName] = useState<string>()
  const [database, setDatabase] = useState<string>()
  const [user, setUser] = useState<string>()
  const [region, setRegion] = useState<IRegion>()

  useEffect(() => {
    onUpdate({
      databaseName: database,
      databaseUser: user,
      name,
      region: region?.id
    })
  }, [database, name, onUpdate, region, user])

  return (
    <ScrollView keyboardShouldPersistTaps="always">
      <View style={styles.main}>
        <Text style={styles.label}>Name</Text>
        <TextBox
          onChangeText={(name) => setName(name)}
          placeholder="Render name for this database"
          style={styles.input}
          value={name}
        />
        <Text style={[styles.label, styles.item]}>Database</Text>
        <TextBox
          autoCapitalize="none"
          onChangeText={(database) => setDatabase(database)}
          placeholder="PostgreSQL database name"
          style={styles.input}
          value={database}
        />
        <Text style={[styles.label, styles.item]}>User</Text>
        <TextBox
          autoCapitalize="none"
          onChangeText={(user) => setUser(user)}
          placeholder="PostgreSQL user name"
          style={styles.input}
          value={user}
        />
        <Picker
          data={regions.map(({ description, id }) => ({
            label: description,
            value: id
          }))}
          onPress={({ label, value }) =>
            setRegion({
              description: label,
              id: value
            })
          }
          placeholder="Choose a region"
          selected={
            region
              ? {
                  label: region.description,
                  value: region.id
                }
              : undefined
          }
          style={styles.item}
          title="Region"
        />
      </View>
      <Separator />
      <DatabasePlan plan={plan} />
      <Separator />
      <Button
        label="Change plan"
        onPress={() => onChangePlan()}
        small
        style={styles.change}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  change: {
    alignSelf: 'center',
    backgroundColor: colors.status.orange,
    marginVertical: layout.margin
  },
  input: {
    backgroundColor: colors.backgroundDark,
    marginTop: layout.padding
  },
  item: {
    marginTop: layout.margin
  },
  label: {
    ...typography.small,
    ...typography.medium
  },
  main: {
    padding: layout.margin
  }
})
