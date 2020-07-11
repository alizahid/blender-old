import React, { FunctionComponent, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { IHeader, IHeaderInput } from '../../../graphql/types'
import { colors, layout, typography } from '../../../styles'
import { Button } from '../../button'
import { TextBox } from '../../text-box'

interface Props {
  loading: boolean
  header?: IHeader

  onCancel?: () => void
  onSave: (data: IHeaderInput) => Promise<void>
}

export const Form: FunctionComponent<Props> = ({
  header,
  loading,
  onCancel,
  onSave
}) => {
  const [path, setPath] = useState<string>()
  const [name, setName] = useState<string>()
  const [value, setValue] = useState<string>()

  useEffect(() => {
    if (header) {
      setPath(header.path)
      setName(header.key)
      setValue(header.value)
    }
  }, [header])

  return (
    <View style={styles.main}>
      <Text style={styles.title}>{`${header ? 'Edit' : 'New'} header`}</Text>
      <TextBox
        onChangeText={(path) => setPath(path)}
        placeholder="Path"
        style={styles.input}
        value={path}
      />
      <TextBox
        onChangeText={(name) => setName(name)}
        placeholder="Name"
        style={styles.input}
        value={name}
      />
      <TextBox
        onChangeText={(value) => setValue(value)}
        placeholder="Value"
        style={styles.input}
        value={value}
      />
      <View style={styles.footer}>
        <Button
          label={header ? 'Save' : 'Create'}
          loading={loading}
          onPress={async () => {
            if (path && name && value) {
              await onSave({
                enabled: true,
                id: header?.id,
                key: name,
                path,
                value
              })

              if (onCancel) {
                onCancel()
              } else {
                setPath(undefined)
                setName(undefined)
                setValue(undefined)
              }
            }
          }}
          style={styles.button}
        />
        {onCancel && (
          <Button
            label="Cancel"
            onPress={() => onCancel()}
            style={[styles.button, styles.cancel]}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1
  },
  cancel: {
    backgroundColor: colors.status.orange,
    marginLeft: layout.margin
  },
  footer: {
    flexDirection: 'row',
    marginTop: layout.margin
  },
  input: {
    ...typography.code,
    marginTop: layout.margin
  },
  main: {
    padding: layout.margin
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground
  }
})
