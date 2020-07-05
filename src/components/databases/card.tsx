import { lowerCase, startCase } from 'lodash'
import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Image from 'react-native-fast-image'

import { img_type_postgresql } from '../../assets'
import { IDatabase, IDatabaseStatus } from '../../graphql/types'
import { colors, layout, typography } from '../../styles'
import { Touchable } from '../touchable'

interface Props {
  database: IDatabase

  onPress: (id: string) => void
}

export const Card: FunctionComponent<Props> = ({ database, onPress }) => (
  <Touchable onPress={() => onPress(database.id)} style={styles.main}>
    <View style={styles.header}>
      <Text style={styles.name}>{database.name}</Text>
      <Image source={img_type_postgresql} style={styles.icon} />
    </View>
    <View style={styles.footer}>
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
      <Text style={styles.status}>{startCase(lowerCase(database.status))}</Text>
    </View>
  </Touchable>
)

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: layout.margin
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  icon: {
    height: layout.icon,
    width: layout.icon
  },
  main: {
    backgroundColor: colors.background,
    padding: layout.margin
  },
  name: {
    ...typography.regular,
    ...typography.medium,
    color: colors.foreground
  },
  state: {
    borderRadius: layout.icon / 2,
    height: layout.icon / 2,
    width: layout.icon / 2
  },
  status: {
    ...typography.small,
    color: colors.foregroundLight,
    marginLeft: layout.padding
  }
})
