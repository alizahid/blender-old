import React, { FunctionComponent, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { IEnvVar, IEnvVarInput } from '../../graphql/types'
import { colors, layout, typography } from '../../styles'
import { TextBox } from '../text-box'

interface Props {
  envVar?: IEnvVar
  isFile?: boolean

  onUpdate: (data: IEnvVarInput) => void
}

export const Form: FunctionComponent<Props> = ({
  envVar,
  isFile,
  onUpdate
}) => {
  const [key, setKey] = useState<string>()
  const [value, setValue] = useState<string>()
  const [multiline, setMultiline] = useState<boolean>(isFile === true)

  useEffect(() => {
    if (envVar) {
      setKey(envVar.key)
      setValue(envVar.value)
      setMultiline(envVar.isFile)
    }
  }, [envVar])

  useEffect(() => {
    if (key && value) {
      if (envVar) {
        onUpdate({
          id: envVar.id,
          isFile: envVar.isFile,
          key,
          value
        })
      } else {
        onUpdate({
          isFile: isFile ?? false,
          key,
          value
        })
      }
    }
  }, [envVar, isFile, key, onUpdate, value])

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Key</Text>
      <TextBox
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(key) => setKey(key)}
        placeholder="Key"
        value={key}
      />
      <Text style={[styles.title, styles.item]}>Value</Text>
      <TextBox
        autoCapitalize="none"
        autoCorrect={false}
        containerStyle={styles.value}
        multiline
        numberOfLines={multiline ? undefined : 1}
        onChangeText={(value) => setValue(value)}
        onKeyPress={(event) => {
          if (multiline && event.nativeEvent.key === 'Enter') {
            event.preventDefault()
          }
        }}
        placeholder="Value"
        style={styles.value}
        value={value}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    marginTop: layout.margin
  },
  main: {
    flex: 1,
    padding: layout.margin
  },
  title: {
    ...typography.regular,
    ...typography.medium,
    color: colors.foreground,
    marginBottom: layout.padding
  },
  value: {
    flex: 1
  }
})
