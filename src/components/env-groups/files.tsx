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
    <Text style={styles.message}>
      You can store secret files (like <Text style={styles.code}>.env</Text> or{' '}
      <Text style={styles.code}>.npmrc</Text> files and private keys) in Render.
      These files can be accessed during builds and in your code just like
      regular files.
    </Text>
    <Text style={styles.message}>
      All secret files you create are available to read at the root of your repo
      (or Docker context). They are also available to load by absolute path at{' '}
      <Text style={styles.code}>{'/etc/secrets/<filename>'}</Text>.
    </Text>
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
  code: {
    ...typography.codeSmall,
    color: colors.primary
  },
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
