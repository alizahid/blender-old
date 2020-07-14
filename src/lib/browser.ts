import { Linking } from 'react-native'

class Browser {
  open(url: string): void {
    Linking.openURL(url)
  }
}

export const browser = new Browser()
