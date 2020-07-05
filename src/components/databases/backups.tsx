import moment from 'moment'
import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Image from 'react-native-fast-image'

import { img_ui_dark_copy } from '../../assets'
import { IBackupEdge } from '../../graphql/types'
import { clipboard } from '../../lib'
import { colors, layout, shadow, typography } from '../../styles'
import { Touchable } from '../touchable'

interface Props {
  backups: IBackupEdge[]
}

export const Backups: FunctionComponent<Props> = ({ backups }) => (
  <View style={styles.main}>
    <Text style={styles.title}>Backups</Text>
    {backups.length === 0 && (
      <Text style={styles.empty}>
        There are no backups right now. Check back later.
      </Text>
    )}
    {backups.map(({ node }) => (
      <View key={node.id} style={styles.item}>
        <Text style={styles.time}>{moment(node.createdAt).format('LLL')}</Text>
        <Touchable
          onPress={() => clipboard.set(node.sqlUrl as string)}
          style={styles.copy}>
          <Image source={img_ui_dark_copy} style={styles.icon} />
          <Text style={styles.label}>sql</Text>
        </Touchable>
        <Touchable
          onPress={() => clipboard.set(node.baseUrl as string)}
          style={styles.copy}>
          <Image source={img_ui_dark_copy} style={styles.icon} />
          <Text style={styles.label}>tar</Text>
        </Touchable>
      </View>
    ))}
  </View>
)

const styles = StyleSheet.create({
  copy: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: layout.margin
  },
  empty: {
    ...typography.small,
    color: colors.foregroundLight,
    marginTop: layout.padding
  },
  icon: {
    height: layout.icon,
    width: layout.icon
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: layout.margin
  },
  label: {
    ...typography.small,
    color: colors.foregroundLight,
    marginLeft: layout.padding / 2
  },
  main: {
    ...shadow,
    backgroundColor: colors.background,
    borderRadius: layout.radius,
    marginHorizontal: layout.margin,
    marginVertical: layout.padding,
    padding: layout.margin
  },
  time: {
    ...typography.small,
    color: colors.foreground,
    flex: 1
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground
  }
})
