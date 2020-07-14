import React, { FunctionComponent } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Image from 'react-native-fast-image'

import { img_type_postgresql } from '../../assets'
import { IDatabase } from '../../graphql/types'
import { colors, layout, typography } from '../../styles'
import { Status } from './status'

interface Props {
  database: IDatabase

  onPress: (id: string) => void
}

export const Card: FunctionComponent<Props> = ({ database, onPress }) => (
  <Pressable onPress={() => onPress(database.id)} style={styles.main}>
    <View style={styles.content}>
      <Text style={styles.name}>{database.name}</Text>
      <Status status={database.status} style={styles.status} />
    </View>
    <Image source={img_type_postgresql} style={styles.icon} />
  </Pressable>
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
  status: {
    marginTop: layout.margin
  }
})
