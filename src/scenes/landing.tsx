import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Image from 'react-native-fast-image'
import { useSafeArea } from 'react-native-safe-area-context'

import { img_blender, img_render } from '../assets'
import { Button } from '../components'
import { AuthParamList } from '../navigators/auth'
import { layout, typography } from '../styles'

interface Props {
  navigation: StackNavigationProp<AuthParamList, 'Landing'>
  route: RouteProp<AuthParamList, 'Landing'>
}

export const Landing: FunctionComponent<Props> = ({
  navigation: { navigate }
}) => {
  const { bottom } = useSafeArea()

  return (
    <View style={styles.main}>
      <View style={styles.content}>
        <Image source={img_blender} style={styles.logo} />
        <Text style={styles.title}>Blender</Text>
        <View style={styles.render}>
          <Text style={styles.subtitle}>for Render</Text>
          <Image source={img_render} style={styles.tinyLogo} />
        </View>
      </View>
      <View
        style={[
          styles.footer,
          {
            marginBottom: layout.margin + bottom
          }
        ]}>
        <Button label="Sign in" onPress={() => navigate('SignIn')} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  footer: {
    margin: layout.margin
  },
  logo: {
    height: 201 / 3,
    marginBottom: layout.margin,
    width: 300 / 3
  },
  main: {
    flex: 1
  },
  render: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: layout.margin * 2
  },
  subtitle: {
    ...typography.subtitle,
    marginRight: layout.padding
  },
  tinyLogo: {
    height: layout.icon,
    width: layout.icon
  },
  title: {
    ...typography.title
  }
})
