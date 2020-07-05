import React, { FunctionComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import Image from 'react-native-fast-image'

import { img_type_postgresql } from '../../assets'
import { IDatabase } from '../../graphql/types'
import { layout } from '../../styles'
import { KeyValue } from '../key-value'
import { Status } from './status'

interface Props {
  database: IDatabase
}

export const Details: FunctionComponent<Props> = ({ database }) => (
  <View style={styles.main}>
    <View style={styles.header}>
      <Status status={database.status} />
      <Image source={img_type_postgresql} style={styles.icon} />
    </View>
    <KeyValue label="Plan" style={styles.item} value={database.plan} />
    <KeyValue
      label="Region"
      style={styles.item}
      value={database.region.description}
    />
    <KeyValue label="Host" style={styles.item} value={database.id} valueMono />
    <KeyValue label="Port" style={styles.item} value="5432" valueMono />
    <KeyValue
      label="Database"
      style={styles.item}
      value={database.databaseName}
      valueMono
    />
    <KeyValue
      label="Username"
      style={styles.item}
      value={database.databaseUser}
      valueMono
    />
    {!!database.password && (
      <>
        <KeyValue
          hidden
          label="Password"
          style={styles.item}
          value={database.password}
          valueMono
        />
        <KeyValue
          hidden
          label="Internal connection string"
          style={styles.item}
          value={`postgres://${database.databaseUser}:${database.password}@${database.id}/${database.name}`}
          valueMono
        />
        <KeyValue
          hidden
          label="External connection string"
          style={styles.item}
          value={`postgres://${database.databaseUser}:${database.password}@postgres.render.com/${database.name}`}
          valueMono
        />
        <KeyValue
          hidden
          label="PSQL command"
          style={styles.item}
          value={`PGPASSWORD=${database.password} psql -h postgres.render.com -U ${database.databaseUser} ${database.databaseName}`}
          valueMono
        />
      </>
    )}
  </View>
)

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  icon: {
    height: layout.icon,
    width: layout.icon
  },
  item: {
    marginTop: layout.margin
  },
  main: {
    padding: layout.margin
  }
})
