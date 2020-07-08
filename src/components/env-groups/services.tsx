import { orderBy } from 'lodash'
import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { IService } from '../../graphql/types'
import { colors, layout, typography } from '../../styles'
import { Card as Service } from '../services'

interface Props {
  services: IService[]
}

export const LinkedServices: FunctionComponent<Props> = ({ services }) => (
  <View>
    <Text style={styles.title}>Linked services</Text>
    {orderBy(services, 'updatedAt', 'desc').map((service) => (
      <Service key={service.id} service={service} style={styles.service} />
    ))}
  </View>
)

const styles = StyleSheet.create({
  service: {
    borderTopColor: colors.backgroundDark,
    borderTopWidth: layout.border
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground,
    margin: layout.margin
  }
})
