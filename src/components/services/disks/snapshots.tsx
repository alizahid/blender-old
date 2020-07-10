import moment from 'moment'
import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Image from 'react-native-fast-image'

import { img_ui_dark_restore } from '../../../assets'
import { IDiskSnapshot } from '../../../graphql/types'
import { colors, layout, typography } from '../../../styles'
import { Touchable } from '../../touchable'

interface Props {
  loading: boolean
  snapshots: IDiskSnapshot[]

  onItemPress: (key: string) => void
}

export const Snapshots: FunctionComponent<Props> = ({
  loading,
  onItemPress,
  snapshots
}) => (
  <View style={styles.main}>
    <Text style={styles.title}>Snapshots</Text>
    {snapshots.length === 0 && (
      <Text style={styles.empty}>
        There are no snapshots available right now. Check back later
      </Text>
    )}
    {snapshots.map((snapshot) => (
      <View key={snapshot.snapshotKey} style={styles.snapshot}>
        <Text style={styles.label}>
          {moment(snapshot.createdAt).format('LLL')}
        </Text>
        {!loading && (
          <Touchable onPress={() => onItemPress(snapshot.snapshotKey)}>
            <Image source={img_ui_dark_restore} style={styles.icon} />
          </Touchable>
        )}
      </View>
    ))}
  </View>
)

const styles = StyleSheet.create({
  empty: {
    ...typography.small,
    color: colors.foregroundLight,
    marginTop: layout.padding
  },
  icon: {
    height: layout.icon,
    width: layout.icon
  },
  label: {
    ...typography.regular,
    color: colors.foreground,
    flex: 1
  },
  main: {
    padding: layout.margin
  },
  snapshot: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: layout.margin
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground
  }
})
