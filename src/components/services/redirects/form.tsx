import React, { FunctionComponent, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { IRedirectRule, IRedirectRuleInput } from '../../../graphql/types'
import { colors, layout, typography } from '../../../styles'
import { Button } from '../../button'
import { Picker } from '../../picker'
import { TextBox } from '../../text-box'

interface Props {
  loading: boolean
  rule?: IRedirectRule

  onCancel?: () => void
  onSave: (data: IRedirectRuleInput) => Promise<void>
}

export const Form: FunctionComponent<Props> = ({
  loading,
  onCancel,
  onSave,
  rule
}) => {
  const [source, setSource] = useState<string>()
  const [destination, setDestination] = useState<string>()
  const [status, setStatus] = useState<string>()

  useEffect(() => {
    if (rule) {
      setSource(rule.source)
      setDestination(rule.destination)
      setStatus(String(rule.httpStatus))
    }
  }, [rule])

  const actions = [
    {
      label: 'Redirect',
      value: '301'
    },
    {
      label: 'Rewrite',
      value: '200'
    }
  ]

  return (
    <View style={styles.main}>
      <Text style={styles.title}>{`${rule ? 'Edit' : 'New'} rule`}</Text>
      <TextBox
        onChangeText={(source) => setSource(source)}
        placeholder="Source"
        style={styles.input}
        value={source}
      />
      <TextBox
        onChangeText={(destination) => setDestination(destination)}
        placeholder="Destination"
        style={styles.input}
        value={destination}
      />
      <Picker
        data={actions}
        onSelect={({ value }) => setStatus(value)}
        placeholder="Action"
        selected={
          status ? actions.find(({ value }) => value === status) : undefined
        }
        style={styles.input}
      />
      <View style={styles.footer}>
        <Button
          label={rule ? 'Save' : 'Create'}
          loading={loading}
          onPress={async () => {
            if (source && destination && status) {
              await onSave({
                destination,
                enabled: true,
                httpStatus: Number(status),
                id: rule?.id,
                source
              })

              if (onCancel) {
                onCancel()
              } else {
                setSource(undefined)
                setDestination(undefined)
                setStatus(undefined)
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
