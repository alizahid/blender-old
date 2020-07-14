import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Image from 'react-native-fast-image'

import {
  img_ui_dark_add,
  img_ui_dark_edit,
  img_ui_dark_remove
} from '../../../assets'
import { IHeader } from '../../../graphql/types'
import { colors, layout, typography } from '../../../styles'
import { KeyValue } from '../../key-value'
import { Spinner } from '../../spinner'
import { Touchable } from '../../touchable'

interface Props {
  headers: IHeader[]
  loading: boolean

  onCreate: () => void
  onEdit: (header: IHeader) => void
  onRemove: (id: string) => void
}

export const Headers: FunctionComponent<Props> = ({
  headers,
  loading,
  onCreate,
  onEdit,
  onRemove
}) => (
  <View style={styles.main}>
    <View style={styles.header}>
      <Text style={styles.title}>HTTP response headers</Text>
      <Touchable onPress={() => onCreate()}>
        <Image source={img_ui_dark_add} style={styles.create} />
      </Touchable>
    </View>
    {headers.length === 0 && <Text style={styles.message}>No headers.</Text>}
    {headers.map((header) => (
      <View key={header.id} style={styles.item}>
        <View style={styles.content}>
          <KeyValue label="Path" value={header.path} valueMono />
          <KeyValue
            label="Name"
            style={styles.input}
            value={header.key}
            valueMono
          />
          <KeyValue
            label="Value"
            style={styles.input}
            value={header.value}
            valueMono
          />
        </View>
        <View style={styles.footer}>
          <Touchable onPress={() => onEdit(header)} style={styles.button}>
            <Image source={img_ui_dark_edit} style={styles.icon} />
          </Touchable>
          {loading ? (
            <View style={styles.button}>
              <Spinner color={colors.status.red} style={styles.spinner} />
            </View>
          ) : (
            <Touchable
              onPress={() => onRemove(header.id)}
              style={styles.button}>
              <Image source={img_ui_dark_remove} style={styles.icon} />
            </Touchable>
          )}
        </View>
      </View>
    ))}
  </View>
)

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flex: 0.25
  },
  content: {
    padding: layout.margin
  },
  create: {
    height: layout.icon,
    width: layout.icon
  },
  footer: {
    backgroundColor: colors.border,
    flexDirection: 'row'
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  icon: {
    height: layout.icon,
    margin: layout.margin,
    opacity: 0.5,
    width: layout.icon
  },
  input: {
    marginTop: layout.margin
  },
  item: {
    backgroundColor: colors.backgroundDark,
    borderRadius: layout.radius,
    marginTop: layout.margin,
    overflow: 'hidden'
  },
  main: {
    padding: layout.margin
  },
  message: {
    ...typography.small,
    color: colors.foregroundLight,
    marginTop: layout.padding
  },
  spinner: {
    margin: layout.margin
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground,
    flex: 1
  }
})
