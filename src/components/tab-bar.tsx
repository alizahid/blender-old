import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'
import { CommonActions } from '@react-navigation/native'
import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { FlatList, Keyboard, StyleSheet, Text, View } from 'react-native'
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
import { colors, layout, typography } from '../styles'
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

export const BottomTabBar: FunctionComponent<BottomTabBarProps> = ({
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
        stylesBottom.main,
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
          style={stylesBottom.link}>
          <Image
            source={
              index === active ? iconsActive[route.name] : icons[route.name]
            }
            style={[stylesBottom.icon, index === active && stylesBottom.active]}
          />
        </Touchable>
      ))}
    </View>
  )
}

const stylesBottom = StyleSheet.create({
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
    backgroundColor: colors.background,
    borderTopColor: colors.backgroundDark,
    borderTopWidth: layout.border * 2,
    flexDirection: 'row'
  }
})

export const TopTabBar: FunctionComponent<MaterialTopTabBarProps> = ({
  descriptors,
  navigation: { dispatch, emit },
  state: { index, key, routes }
}) => {
  const list = useRef<FlatList>(null)

  useEffect(() => {
    list.current?.scrollToIndex({
      index
    })
  }, [index])

  return (
    <View style={stylesTop.main}>
      <FlatList
        data={routes}
        horizontal
        initialNumToRender={routes.length}
        ref={list}
        renderItem={({ index: active, item }) => (
          <Touchable
            onPress={() => {
              const event = emit({
                canPreventDefault: true,
                target: item.key,
                type: 'tabPress'
              })

              if (index !== active && !event.defaultPrevented) {
                dispatch({
                  ...CommonActions.navigate(item.name),
                  target: key
                })
              }
            }}
            style={stylesTop.link}>
            {descriptors[item.key].options.tabBarIcon && (
              <Image
                source={descriptors[item.key].options.tabBarIcon as Source}
                style={[
                  stylesTop.icon,
                  index === active && stylesTop.iconActive
                ]}
              />
            )}
            <Text
              style={[stylesTop.label, index === active && stylesTop.active]}>
              {descriptors[item.key].options.title}
            </Text>
          </Touchable>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  )
}

const stylesTop = StyleSheet.create({
  active: {
    ...typography.medium,
    color: colors.foreground
  },
  icon: {
    height: layout.icon,
    marginRight: layout.padding,
    opacity: 0.25,
    width: layout.icon
  },
  iconActive: {
    opacity: 1
  },
  label: {
    ...typography.small,
    color: colors.foregroundLight
  },
  link: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    padding: layout.margin
  },
  main: {
    backgroundColor: colors.background,
    borderBottomColor: colors.backgroundDark,
    borderBottomWidth: layout.border
  }
})
