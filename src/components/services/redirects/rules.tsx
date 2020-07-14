import React, { FunctionComponent } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Image from 'react-native-fast-image'

import {
  img_ui_dark_add,
  img_ui_dark_edit,
  img_ui_dark_move_down,
  img_ui_dark_move_up,
  img_ui_dark_remove
} from '../../../assets'
import { IRedirectRule } from '../../../graphql/types'
import { colors, layout, typography } from '../../../styles'
import { KeyValue } from '../../key-value'
import { Spinner } from '../../spinner'

interface Props {
  rules: IRedirectRule[]
  loading: boolean

  onCreate: () => void
  onEdit: (rule: IRedirectRule) => void
  onMoveDown: (id: string) => void
  onMoveUp: (id: string) => void
  onRemove: (id: string) => void
}

export const Rules: FunctionComponent<Props> = ({
  loading,
  onCreate,
  onEdit,
  onMoveDown,
  onMoveUp,
  onRemove,
  rules
}) => (
  <View style={styles.main}>
    <View style={styles.header}>
      <Text style={styles.title}>Redirect and rewrite rules</Text>
      <Pressable onPress={() => onCreate()}>
        <Image source={img_ui_dark_add} style={styles.create} />
      </Pressable>
    </View>
    {rules.length === 0 && <Text style={styles.message}>No rules.</Text>}
    {rules.map((rule, index) => (
      <View key={rule.id} style={styles.item}>
        <View style={styles.content}>
          <KeyValue label="Source" value={rule.source} valueMono />
          <KeyValue
            label="Destination"
            style={styles.input}
            value={rule.destination}
            valueMono
          />
          <KeyValue
            label="Action"
            style={styles.input}
            value={rule.httpStatus === 200 ? 'Rewrite' : 'Redirect'}
          />
        </View>
        <View style={styles.footer}>
          <Pressable onPress={() => onEdit(rule)} style={styles.button}>
            <Image source={img_ui_dark_edit} style={styles.icon} />
          </Pressable>
          {loading ? (
            <View style={styles.button}>
              <Spinner color={colors.status.red} style={styles.spinner} />
            </View>
          ) : (
            <Pressable onPress={() => onRemove(rule.id)} style={styles.button}>
              <Image source={img_ui_dark_remove} style={styles.icon} />
            </Pressable>
          )}
          {index > 0 && (
            <Pressable onPress={() => onMoveUp(rule.id)} style={styles.button}>
              <Image source={img_ui_dark_move_up} style={styles.icon} />
            </Pressable>
          )}
          {index !== rules.length - 1 && (
            <Pressable
              onPress={() => onMoveDown(rule.id)}
              style={styles.button}>
              <Image source={img_ui_dark_move_down} style={styles.icon} />
            </Pressable>
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
