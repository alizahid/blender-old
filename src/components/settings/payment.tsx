import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { IUser } from '../../graphql/types'
import { colors, layout, shadow, typography } from '../../styles'
import { KeyValue } from '../key-value'

interface Props {
  user: IUser
}

export const Payment: FunctionComponent<Props> = ({ user }) => (
  <View style={styles.main}>
    <Text style={styles.title}>Payment method</Text>
    {user.canBill ? (
      <>
        <KeyValue label="Type" style={styles.item} value={user.cardBrand} />
        <KeyValue label="Last 4" style={styles.item} value={user.cardLast4} />
      </>
    ) : (
      <Text style={styles.empty}>No payment method added.</Text>
    )}
  </View>
)

const styles = StyleSheet.create({
  empty: {
    ...typography.small,
    color: colors.foregroundLight,
    marginTop: layout.margin
  },
  item: {
    marginTop: layout.margin
  },
  main: {
    ...shadow,
    backgroundColor: colors.background,
    borderRadius: layout.radius,
    marginHorizontal: layout.margin,
    marginVertical: layout.padding,
    padding: layout.margin
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground
  }
})
