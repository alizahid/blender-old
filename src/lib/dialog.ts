import { Alert } from 'react-native'

class Dialog {
  alert(title: string, message: string): void {
    Alert.alert(title, message)
  }

  confirm(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) =>
      Alert.alert(title, message, [
        {
          onPress: () => resolve(false),
          style: 'cancel',
          text: 'No'
        },
        {
          onPress: () => resolve(true),
          style: 'destructive',
          text: 'Yes'
        }
      ])
    )
  }

  prompt(title: string, message: string): Promise<string | undefined> {
    return new Promise((resolve) =>
      Alert.prompt(title, message, [
        {
          onPress: () => resolve(),
          style: 'cancel',
          text: 'Cancel'
        },
        {
          onPress: (value) => resolve(value),
          text: 'Submit'
        }
      ])
    )
  }
}

export const dialog = new Dialog()
