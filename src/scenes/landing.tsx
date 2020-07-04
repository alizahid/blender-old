import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Image from 'react-native-fast-image'

import { img_blender } from '../assets'

export const Landing: FunctionComponent = () => (
  <View style={styles.main}>
    <Image source={img_blender} style={styles.logo} />
    <Text style={styles.title}>blender</Text>
    <Text style={styles.subtitle}>for Render</Text>
  </View>
)

const styles = StyleSheet.create({
  logo: {
    height: 50,
    width: 50
  },
  main: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  subtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 20
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 40,
    marginBottom: 10,
    marginTop: 20
  }
})
