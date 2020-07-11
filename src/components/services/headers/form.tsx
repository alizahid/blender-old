import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'

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

  const nameRef = useRef<TextInput>(null)
  const valueRef = useRef<TextInput>(null)

  useEffect(() => {
    if (header) {
      setPath(header.path)
      setName(header.key)
      setValue(header.value)
    }
  }, [header])

  const submit = async () => {
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
  }

  return (
    <View style={styles.main}>
      <Text style={styles.title}>{`${header ? 'Edit' : 'New'} header`}</Text>
      <TextBox
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(path) => setPath(path)}
        onSubmitEditing={() => nameRef.current?.focus()}
        placeholder="Path"
        returnKeyType="next"
        style={styles.input}
        value={path}
      />
      <TextBox
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(name) => setName(name)}
        onSubmitEditing={() => valueRef.current?.focus()}
        placeholder="Name"
        ref={nameRef}
        returnKeyType="next"
        style={styles.input}
        value={name}
      />
      <TextBox
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(value) => setValue(value)}
        onSubmitEditing={() => submit()}
        placeholder="Value"
        ref={valueRef}
        returnKeyType="go"
        style={styles.input}
        value={value}
      />
      <View style={styles.footer}>
        <Button
          label={header ? 'Save' : 'Create'}
          loading={loading}
          onPress={() => submit()}
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
