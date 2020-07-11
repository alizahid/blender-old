import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'

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

  const databaseRef = useRef<TextInput>(null)
  const userRef = useRef<TextInput>(null)

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
          onSubmitEditing={() => databaseRef.current?.focus()}
          placeholder="Render name for this database"
          returnKeyType="next"
          style={styles.input}
          value={name}
        />
        <Text style={[styles.label, styles.item]}>Database</Text>
        <TextBox
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(database) => setDatabase(database)}
          onSubmitEditing={() => userRef.current?.focus()}
          placeholder="PostgreSQL database name"
          ref={databaseRef}
          returnKeyType="next"
          style={styles.input}
          value={database}
        />
        <Text style={[styles.label, styles.item]}>User</Text>
        <TextBox
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(user) => setUser(user)}
          placeholder="PostgreSQL user name"
          ref={userRef}
          returnKeyType="done"
          style={styles.input}
          value={user}
        />
        <Picker
          data={regions.map(({ description, id }) => ({
            label: description,
            value: id
          }))}
          onSelect={({ label, value }) =>
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
