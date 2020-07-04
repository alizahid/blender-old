import { lowerCase, startCase } from 'lodash'
import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Image from 'react-native-fast-image'

import { img_type_postgresql } from '../../assets'
import { IDatabase, IDatabaseStatus } from '../../graphql/types'
import { colors, layout, shadow, typography } from '../../styles'
import { KeyValue } from '../key-value'

interface Props {
  database: IDatabase
}

export const Details: FunctionComponent<Props> = ({ database }) => (
  <View style={styles.main}>
    <View style={styles.header}>
      <View style={styles.status}>
        <View
          style={[
            styles.state,
            {
              backgroundColor:
                database.status === IDatabaseStatus.Available
                  ? colors.status.green
                  : database.status === IDatabaseStatus.Unavailable
                  ? colors.status.red
                  : colors.status.yellow
            }
          ]}
        />
        <Text style={styles.statusLabel}>
          {startCase(lowerCase(database.status))}
        </Text>
      </View>
      <Image source={img_type_postgresql} style={styles.icon} />
    </View>
    <KeyValue label="Plan" style={styles.item} value={database.plan} />
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
    ...shadow,
    backgroundColor: colors.background,
    borderRadius: layout.radius,
    marginHorizontal: layout.margin,
    marginVertical: layout.padding,
    padding: layout.margin
  },
  state: {
    borderRadius: layout.icon / 2,
    height: layout.icon / 2,
    width: layout.icon / 2
  },
  status: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  statusLabel: {
    ...typography.small,
    color: colors.foregroundLight,
    marginLeft: layout.padding
  }
})
