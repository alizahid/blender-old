import { orderBy } from 'lodash'
import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Image from 'react-native-fast-image'
import Swipeable from 'react-native-gesture-handler/Swipeable'

import { img_ui_dark_add } from '../../assets'
import { IEnvVar } from '../../graphql/types'
import { colors, layout, typography } from '../../styles'
import { KeyValue } from '../key-value'
import { Touchable } from '../touchable'
import { Actions } from './actions'

interface Props {
  envVars: IEnvVar[]
  removing: boolean

  onCreate: () => void
  onEdit: (envVar: IEnvVar) => void
  onRemove: (id: string) => void
}

export const SecretFiles: FunctionComponent<Props> = ({
  envVars,
  onCreate,
  onEdit,
  onRemove,
  removing
}) => (
  <View style={styles.main}>
    <View style={styles.header}>
      <Text style={styles.title}>Secret Files</Text>
      <Touchable onPress={() => onCreate()}>
        <Image source={img_ui_dark_add} style={styles.icon} />
      </Touchable>
    </View>
    {envVars.length === 0 && (
      <Text style={styles.message}>No secret files.</Text>
    )}
    {orderBy(envVars, 'key', 'asc').map((envVar) => (
      <Swipeable
        containerStyle={styles.item}
        key={envVar.id}
        renderLeftActions={() => (
          <Actions
            onEdit={() => onEdit(envVar)}
            onRemove={() => onRemove(envVar.id)}
            removing={removing}
          />
        )}>
        <KeyValue
          hidden
          label={envVar.key}
          labelMono
          style={styles.data}
          value={envVar.value}
          valueMono
        />
      </Swipeable>
    ))}
  </View>
)

const styles = StyleSheet.create({
  data: {
    backgroundColor: colors.background,
    marginRight: -layout.padding
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row'
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
  },
  message: {
    ...typography.small,
    color: colors.foregroundLight,
    marginTop: layout.padding
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground,
    flex: 1
  }
})
