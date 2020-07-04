import React, { FunctionComponent, useState } from 'react'
import {
  FlatList,
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle
} from 'react-native'
import Image from 'react-native-fast-image'
import { useSafeArea } from 'react-native-safe-area-context'

import { img_ui_light_close } from '../assets'
import { colors, layout, shadow, typography } from '../styles'
import { Separator } from './separator'
import { Touchable } from './touchable'

interface Data {
  label: string
  value: string
}

interface Props {
  data: Data[]
  placeholder: string
  selected?: Data
  style?: StyleProp<ViewStyle>
  title: string

  onPress: (data: Data) => void
}

export const Picker: FunctionComponent<Props> = ({
  data,
  onPress,
  placeholder,
  selected,
  style,
  title
}) => {
  const { bottom, top } = useSafeArea()

  const [visible, setVisible] = useState(false)

  return (
    <>
      <View style={style}>
        <Text style={styles.title}>{title}</Text>
        <Touchable onPress={() => setVisible(true)} style={styles.input}>
          <Text style={[styles.label, !selected && styles.placeholder]}>
            {selected?.label ?? placeholder}
          </Text>
        </Touchable>
      </View>
      <Modal animationType="fade" transparent visible={visible}>
        <View
          style={[
            styles.modal,
            {
              paddingBottom: bottom,
              paddingTop: top
            }
          ]}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.headerLabel}>{title}</Text>
              <Touchable onPress={() => setVisible(false)}>
                <Image source={img_ui_light_close} />
              </Touchable>
            </View>
            <FlatList
              ItemSeparatorComponent={Separator}
              data={data}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Touchable
                  onPress={() => {
                    onPress(item)

                    setVisible(false)
                  }}
                  style={styles.item}>
                  <Text>{item.label}</Text>
                </Touchable>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  content: {
    ...shadow,
    backgroundColor: colors.background,
    borderRadius: layout.radius,
    margin: layout.margin * 2
  },
  header: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: layout.radius,
    borderTopRightRadius: layout.radius,
    flexDirection: 'row'
  },
  headerLabel: {
    ...typography.subtitle,
    color: colors.background,
    flex: 1,
    margin: layout.margin
  },
  input: {
    backgroundColor: colors.backgroundDark,
    borderRadius: layout.radius,
    height: layout.textBox,
    justifyContent: 'center',
    marginTop: layout.padding,
    paddingHorizontal: layout.margin
  },
  item: {
    padding: layout.margin
  },
  label: {
    ...typography.regular,
    color: colors.foreground
  },
  modal: {
    backgroundColor: colors.modal,
    flex: 1,
    justifyContent: 'center'
  },
  placeholder: {
    color: colors.foregroundLight
  },
  title: {
    ...typography.small,
    ...typography.medium
  }
})
