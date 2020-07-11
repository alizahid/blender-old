import React, { FunctionComponent } from 'react'
import { Modal, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'

import { colors, layout } from '../styles'
import { KeyboardView } from './keyboard-view'

interface Props {
  style?: StyleProp<ViewStyle>
}

export const Overlay: FunctionComponent<Props> = ({ children, style }) => {
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
  main: {
    backgroundColor: colors.background,
    borderRadius: layout.radius,
    margin: layout.margin * 2,
    overflow: 'hidden'
  },
  modal: {
    backgroundColor: colors.modal,
    flex: 1,
    justifyContent: 'center'
  }
})
