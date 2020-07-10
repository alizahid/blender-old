import React, { FunctionComponent, useEffect, useState } from 'react'
import {
  KeyboardType,
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle
} from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'

import { mitter } from '../lib'
import { colors, layout, typography } from '../styles'
import { KeyboardView } from './keyboard-view'
import { TextBox } from './text-box'
import { Touchable } from './touchable'

export interface DialogProps {
  props:
    | AlertDialogProps
    | ConfirmDialogProps
    | KeyValueDialogProps
    | PromptDialogProps
  type: 'alert' | 'confirm' | 'keyValue' | 'prompt'
}

export const Dialog: FunctionComponent = () => {
  const [props, setProps] = useState<DialogProps['props']>()
  const [type, setType] = useState<DialogProps['type']>()

  useEffect(() => {
    const handler = ({ props, type }: DialogProps) => {
      setProps(props)
      setType(type)
    }

    mitter.on('dialog', handler)

    return () => {
      mitter.off('dialog', handler)
    }
  }, [])

  if (!props) {
    return null
  }

  const onClose = () => {
    setProps(undefined)
    setType(undefined)
  }

  if (type === 'alert') {
    return <AlertDialog {...(props as AlertDialogProps)} onClose={onClose} />
  }

  if (type === 'confirm') {
    return (
      <ConfirmDialog {...(props as ConfirmDialogProps)} onClose={onClose} />
    )
  }

  if (type === 'keyValue') {
    return (
      <KeyValueDialog {...(props as KeyValueDialogProps)} onClose={onClose} />
    )
  }

  if (type === 'prompt') {
    return <PromptDialog {...(props as PromptDialogProps)} onClose={onClose} />
  }

  return null
}

interface AlertDialogProps {
  message: string
  title: string

  onClose: () => void
}

const AlertDialog: FunctionComponent<AlertDialogProps> = ({
  message,
  onClose,
  title
}) => (
  <Overlay>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    <View style={styles.footer}>
      <Touchable onPress={() => onClose()} style={styles.button}>
        <Text style={styles.label}>Okay</Text>
      </Touchable>
    </View>
  </Overlay>
)

interface ConfirmDialogProps {
  message: string
  title: string

  onClose: () => void
  onNo: () => void
  onYes: () => void
}

const ConfirmDialog: FunctionComponent<ConfirmDialogProps> = ({
  message,
  onClose,
  onNo,
  onYes,
  title
}) => (
  <Overlay>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
    <View style={styles.footer}>
      <Touchable
        onPress={() => {
          onNo()
          onClose()
        }}
        style={styles.button}>
        <Text style={styles.label}>No</Text>
      </Touchable>
      <Touchable
        onPress={() => {
          onYes()
          onClose()
        }}
        style={styles.button}>
        <Text style={[styles.label, styles.yes]}>Yes</Text>
      </Touchable>
    </View>
  </Overlay>
)

interface PromptDialogProps {
  initialValue?: string
  inputStyle?: StyleProp<TextStyle>
  keyboardType?: KeyboardType
  message: string
  messageStyle?: StyleProp<TextStyle>
  multiline?: boolean
  placeholder: string
  title: string

  onCancel: () => void
  onClose: () => void
  onSubmit: (value: string) => void
}

const PromptDialog: FunctionComponent<PromptDialogProps> = ({
  initialValue,
  inputStyle,
  keyboardType,
  message,
  messageStyle,
  multiline,
  onCancel,
  onClose,
  onSubmit,
  placeholder,
  title
}) => {
  const [value, setValue] = useState<string | undefined>(initialValue)

  return (
    <Overlay>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.message, messageStyle]}>{message}</Text>
      <TextBox
        containerStyle={styles.input}
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={(value) => setValue(value)}
        placeholder={placeholder}
        style={[!multiline && styles.input, inputStyle]}
        value={value}
      />
      <View style={styles.footer}>
        <Touchable
          onPress={() => {
            onCancel()
            onClose()
          }}
          style={styles.button}>
          <Text style={[styles.label, styles.yes]}>Cancel</Text>
        </Touchable>
        <Touchable
          onPress={() => {
            if (value) {
              onSubmit(value)
              onClose()
            }
          }}
          style={styles.button}>
          <Text style={styles.label}>Submit</Text>
        </Touchable>
      </View>
    </Overlay>
  )
}

interface KeyValueDialogProps {
  initialLabel?: string
  initialValue?: string
  labelKeyboardType?: KeyboardType
  labelMultiline?: boolean
  labelPlaceholder: string
  labelStyle?: StyleProp<TextStyle>
  title: string
  valueKeyboardType?: KeyboardType
  valueMultiline?: boolean
  valuePlaceholder: string
  valueStyle?: StyleProp<TextStyle>

  onCancel: () => void
  onClose: () => void
  onSubmit: (label: string, value: string) => void
}

const KeyValueDialog: FunctionComponent<KeyValueDialogProps> = ({
  initialLabel,
  initialValue,
  labelKeyboardType,
  labelMultiline,
  labelPlaceholder,
  labelStyle,
  onCancel,
  onClose,
  onSubmit,
  title,
  valueKeyboardType,
  valueMultiline,
  valuePlaceholder,
  valueStyle
}) => {
  const [label, setLabel] = useState<string | undefined>(initialLabel)
  const [value, setValue] = useState<string | undefined>(initialValue)

  return (
    <Overlay>
      <Text style={styles.title}>{title}</Text>
      <TextBox
        containerStyle={styles.input}
        keyboardType={labelKeyboardType}
        multiline={labelMultiline}
        onChangeText={(label) => setLabel(label)}
        placeholder={labelPlaceholder}
        style={[!labelMultiline && styles.input, labelStyle]}
        value={label}
      />
      <TextBox
        containerStyle={styles.input}
        keyboardType={valueKeyboardType}
        multiline={valueMultiline}
        onChangeText={(value) => setValue(value)}
        placeholder={valuePlaceholder}
        style={[!valueMultiline && styles.input, valueStyle]}
        value={value}
      />
      <View style={styles.footer}>
        <Touchable
          onPress={() => {
            onCancel()
            onClose()
          }}
          style={styles.button}>
          <Text style={[styles.label, styles.yes]}>Cancel</Text>
        </Touchable>
        <Touchable
          onPress={() => {
            if (label && value) {
              onSubmit(label, value)
              onClose()
            }
          }}
          style={styles.button}>
          <Text style={styles.label}>Submit</Text>
        </Touchable>
      </View>
    </Overlay>
  )
}

interface OverlayProps {
  style?: StyleProp<ViewStyle>
}

export const Overlay: FunctionComponent<OverlayProps> = ({
  children,
  style
}) => {
  const { bottom, top } = useSafeArea()

  return (
    <Modal animationType="fade" transparent visible>
      <KeyboardView>
        <View
          style={[
            styles.modal,
            {
              paddingBottom: bottom,
              paddingTop: top
            }
          ]}>
          <View style={[styles.main, style]}>{children}</View>
        </View>
      </KeyboardView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  button: {
    flex: 1
  },
  footer: {
    borderTopColor: colors.backgroundDark,
    borderTopWidth: layout.border,
    flexDirection: 'row',
    marginTop: layout.margin
  },
  input: {
    marginHorizontal: layout.margin,
    marginTop: layout.margin
  },
  label: {
    ...typography.regular,
    ...typography.medium,
    alignSelf: 'center',
    color: colors.primary,
    margin: layout.margin
  },
  main: {
    backgroundColor: colors.background,
    borderRadius: layout.radius,
    margin: layout.margin * 2,
    overflow: 'hidden'
  },
  message: {
    ...typography.regular,
    alignSelf: 'center',
    color: colors.foreground,
    lineHeight: layout.lineHeight * typography.regular.fontSize,
    margin: layout.margin,
    marginBottom: 0,
    textAlign: 'center'
  },
  modal: {
    backgroundColor: colors.modal,
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    ...typography.subtitle,
    alignSelf: 'center',
    color: colors.foreground,
    margin: layout.margin,
    marginBottom: 0,
    textAlign: 'center'
  },
  yes: {
    color: colors.status.red
  }
})
