import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Image from 'react-native-fast-image'

import {
  img_ui_dark_edit,
  img_ui_dark_move_down,
  img_ui_dark_move_up,
  img_ui_dark_remove
} from '../../../assets'
import { IRedirectRule } from '../../../graphql/types'
import { colors, layout, typography } from '../../../styles'
import { KeyValue } from '../../key-value'
import { Spinner } from '../../spinner'
import { Touchable } from '../../touchable'

interface Props {
  rules: IRedirectRule[]
  loading: boolean

  onEdit: (rule: IRedirectRule) => void
  onMoveDown: (id: string) => void
  onMoveUp: (id: string) => void
  onRemove: (id: string) => void
}

export const Rules: FunctionComponent<Props> = ({
  loading,
  onEdit,
  onMoveDown,
  onMoveUp,
  onRemove,
  rules
}) => (
  <View style={styles.main}>
    <Text style={styles.title}>Redirect and rewrite rules</Text>
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
          <Touchable onPress={() => onEdit(rule)} style={styles.button}>
            <Image source={img_ui_dark_edit} style={styles.icon} />
          </Touchable>
          {loading ? (
            <View style={styles.button}>
              <Spinner color={colors.status.red} style={styles.spinner} />
            </View>
          ) : (
            <Touchable onPress={() => onRemove(rule.id)} style={styles.button}>
              <Image source={img_ui_dark_remove} style={styles.icon} />
            </Touchable>
          )}
          {index > 0 && (
            <Touchable onPress={() => onMoveUp(rule.id)} style={styles.button}>
              <Image source={img_ui_dark_move_up} style={styles.icon} />
            </Touchable>
          )}
          {index !== rules.length - 1 && (
            <Touchable
              onPress={() => onMoveDown(rule.id)}
              style={styles.button}>
              <Image source={img_ui_dark_move_down} style={styles.icon} />
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
  footer: {
    backgroundColor: colors.border,
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
  spinner: {
    margin: layout.margin
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground
  }
})
