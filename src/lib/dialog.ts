import {
  KeyboardType,
  StyleProp,
  TextInputProps,
  TextStyle
} from 'react-native'

import { mitter } from './mitter'

interface AlertProps {
  message: string
  title: string
}

interface PromptProps extends AlertProps {
  autoCapitalize?: TextInputProps['autoCapitalize']
  autoCorrect?: TextInputProps['autoCorrect']
  initialValue?: string
  inputStyle?: StyleProp<TextStyle>
  keyboardType?: KeyboardType
  messageStyle?: StyleProp<TextStyle>
  multiline?: boolean
  placeholder: string
}

interface KeyValueProps {
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
}

class Dialog {
  alert(props: AlertProps): void {
    mitter.emit('dialog', {
      props,
      type: 'alert'
    })
  }

  confirm(props: AlertProps): Promise<boolean> {
    return new Promise((resolve) =>
      mitter.emit('dialog', {
        props: {
          ...props,
          onNo: () => resolve(false),
          onYes: () => resolve(true)
        },
        type: 'confirm'
      })
    )
  }

  prompt(props: PromptProps): Promise<string | undefined> {
    return new Promise((resolve) =>
      mitter.emit('dialog', {
        props: {
          ...props,
          onCancel: () => resolve(),
          onSubmit: (value: string) => resolve(value)
        },
        type: 'prompt'
      })
    )
  }

  keyValue(
    props: KeyValueProps
  ): Promise<
    | {
        key: string
        value: string
      }
    | undefined
  > {
    return new Promise((resolve) =>
      mitter.emit('dialog', {
        props: {
          ...props,
          onCancel: () => resolve(),
          onSubmit: (key: string, value: string) =>
            resolve({
              key,
              value
            })
        },
        type: 'keyValue'
      })
    )
  }
}

export const dialog = new Dialog()
