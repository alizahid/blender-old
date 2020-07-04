import Clipboard from '@react-native-community/clipboard'

class Clippy {
  set(string: string): void {
    Clipboard.setString(string)
  }
}

export const clipboard = new Clippy()
