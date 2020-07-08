import React, { FunctionComponent } from 'react'
import { StyleSheet, View } from 'react-native'

import { IDisk } from '../../../graphql/types'
import { layout } from '../../../styles'
import { KeyValue } from '../../key-value'

interface Props {
  disk: IDisk
}

export const Disk: FunctionComponent<Props> = ({ disk }) => (
  <View style={styles.main}>
    <KeyValue label="Name" value={disk.name} />
    <KeyValue
      label="Mount path"
      style={styles.item}
      value={disk.mountPath}
      valueMono
    />
    <KeyValue
      label="Size"
      style={styles.item}
      value={`${disk.sizeGB} GB`}
      valueMono
    />
  </View>
)

const styles = StyleSheet.create({
  item: {
    marginTop: layout.margin
  },
  main: {
    padding: layout.margin
  }
})
