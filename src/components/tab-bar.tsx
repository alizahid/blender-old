import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { CommonActions } from '@react-navigation/native'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { Keyboard, StyleSheet, View } from 'react-native'
import Image, { Source } from 'react-native-fast-image'
import { useSafeArea } from 'react-native-safe-area-context'

import {
  img_nav_databases,
  img_nav_databases_active,
  img_nav_env,
  img_nav_env_active,
  img_nav_servers,
  img_nav_servers_active,
  img_nav_settings,
  img_nav_settings_active
} from '../assets'
import { layout } from '../styles'
import { Touchable } from './touchable'

const icons: Record<string, Source> = {
  Databases: img_nav_databases,
  EnvGroups: img_nav_env,
  Services: img_nav_servers,
  Settings: img_nav_settings
}

const iconsActive: Record<string, Source> = {
  Databases: img_nav_databases_active,
  EnvGroups: img_nav_env_active,
  Services: img_nav_servers_active,
  Settings: img_nav_settings_active
}

export const TabBar: FunctionComponent<BottomTabBarProps> = ({
  navigation: { dispatch, emit },
  state: { index, key, routes }
}) => {
  const { bottom } = useSafeArea()

  const [visible, setVisible] = useState(true)

  useEffect(() => {
    Keyboard.addListener('keyboardWillHide', () => setVisible(true))
    Keyboard.addListener('keyboardWillShow', () => setVisible(false))

    return () => {
      Keyboard.removeListener('keyboardWillHide', () => setVisible(true))
      Keyboard.removeListener('keyboardWillShow', () => setVisible(false))
    }
  }, [])

  if (!visible) {
    return null
  }

  return (
    <View
      style={[
        styles.main,
        {
          paddingBottom: bottom
        }
      ]}>
      {routes.map((route, active) => (
        <Touchable
          key={active}
          onPress={() => {
            const event = emit({
              canPreventDefault: true,
              target: route.key,
              type: 'tabPress'
            })

            if (index !== active && !event.defaultPrevented) {
              dispatch({
                ...CommonActions.navigate(route.name),
                target: key
              })
            }
          }}
          style={styles.link}>
          <Image
            source={
              index === active ? iconsActive[route.name] : icons[route.name]
            }
            style={[styles.icon, index === active && styles.active]}
          />
        </Touchable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  active: {
    opacity: 1
  },
  icon: {
    height: layout.icon,
    opacity: 0.25,
    width: layout.icon
  },
  link: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: layout.margin
  },
  main: {
    flexDirection: 'row'
  }
})
