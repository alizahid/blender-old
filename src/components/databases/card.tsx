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
    <View style={styles.content}>
      <Text style={styles.name}>{database.name}</Text>
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
    </View>
    <Image source={img_type_postgresql} style={styles.icon} />
  </Touchable>
)

const styles = StyleSheet.create({
  content: {
    flex: 1
  },
  icon: {
    height: layout.icon,
    width: layout.icon
  },
  main: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flexDirection: 'row',
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
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: layout.margin
  },
  statusLabel: {
    ...typography.small,
    color: colors.foregroundLight,
    marginLeft: layout.padding
  }
})
