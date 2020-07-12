import 'react-native-gesture-handler'

import { AppRegistry } from 'react-native'
import { SENTRY_DSN } from 'react-native-dotenv'

import { name } from './app.json'
import { Blender } from './src'
import { sentry } from './src/lib'

sentry.init({
  dsn: SENTRY_DSN
})

AppRegistry.registerComponent(name, () => Blender)
