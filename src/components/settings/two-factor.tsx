import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { IUser } from '../../graphql/types'
import { colors, layout, shadow, typography } from '../../styles'

interface Props {
  user: IUser
}

export const TwoFactor: FunctionComponent<Props> = ({ user }) => (
  <View style={styles.main}>
    <Text style={styles.title}>Two-factor authentication</Text>
    <Text style={styles.message}>
      {user.otpEnabled
        ? 'Your account is protected by two-factor authentication.'
        : 'You can enable two-factor authentication on the Render website.'}
    </Text>
  </View>
)

const styles = StyleSheet.create({
  main: {
    ...shadow,
    backgroundColor: colors.background,
    borderRadius: layout.radius,
    marginHorizontal: layout.margin,
    marginVertical: layout.padding,
    padding: layout.margin
  },
  message: {
    ...typography.small,
    color: colors.foregroundLight,
    marginTop: layout.margin
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground
  }
})
