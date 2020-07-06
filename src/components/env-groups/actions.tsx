import React, { FunctionComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import Image from 'react-native-fast-image'

import { img_ui_dark_edit, img_ui_dark_remove } from '../../assets'
import { layout } from '../../styles'
import { Spinner } from '../spinner'
import { Touchable } from '../touchable'

interface Props {
  removing: boolean

  onEdit: () => void
  onRemove: () => void
}

export const Actions: FunctionComponent<Props> = ({
  onEdit,
  onRemove,
  removing
}) => (
  <View style={styles.main}>
    <Touchable onPress={() => onEdit()} style={styles.action}>
      <Image source={img_ui_dark_edit} style={styles.icon} />
    </Touchable>
    {removing ? (
      <Spinner style={styles.spinner} />
    ) : (
      <Touchable onPress={() => onRemove()} style={styles.action}>
        <Image source={img_ui_dark_remove} style={styles.icon} />
      </Touchable>
    )}
  </View>
)

const styles = StyleSheet.create({
  action: {
    marginRight: layout.padding,
    padding: layout.padding
  },
  icon: {
    height: layout.icon,
    opacity: 0.5,
    width: layout.icon
  },
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: layout.padding
  },
  spinner: {
    marginHorizontal: layout.padding
  }
})
