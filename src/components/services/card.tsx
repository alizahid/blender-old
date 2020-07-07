import moment from 'moment'
import React, { FunctionComponent } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'
import Image from 'react-native-fast-image'

import { img_type_github, img_type_gitlab } from '../../assets'
import { IService } from '../../graphql/types'
import { colors, layout, typography } from '../../styles'
import { Touchable } from '../touchable'

interface Props {
  service: IService
  style?: StyleProp<ViewStyle>

  onPress: (id: string) => void
}

export const Card: FunctionComponent<Props> = ({ onPress, service, style }) => (
  <Touchable onPress={() => onPress(service.id)} style={[styles.main, style]}>
    <View style={styles.left}>
      <View style={styles.header}>
        <Text style={styles.name}>{service.name}</Text>
        <View
          style={[
            styles.status,
            {
              backgroundColor:
                service.state === 'Running'
                  ? colors.status.green
                  : colors.status.orange
            }
          ]}
        />
      </View>
      <View style={styles.repo}>
        <Image
          source={
            service.repo.provider === 'GITHUB'
              ? img_type_github
              : img_type_gitlab
          }
          style={styles.icon}
        />
        <Text style={styles.label}>
          {service.repo.ownerName}/{service.repo.name}
        </Text>
      </View>
    </View>
    <View style={styles.right}>
      <View style={styles.tags}>
        <View style={styles.tag}>
          <Text style={styles.tagLabel}>{service.userFacingType}</Text>
        </View>
        {service.userFacingType !== service.env.name && (
          <View style={styles.tag}>
            <Text style={styles.tagLabel}>{service.env.name}</Text>
          </View>
        )}
      </View>
      <Text style={styles.label}>
        Updated {moment(service.updatedAt).fromNow()}
      </Text>
    </View>
  </Touchable>
)

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  icon: {
    height: layout.icon,
    width: layout.icon
  },
  label: {
    ...typography.small,
    color: colors.foregroundLight,
    marginLeft: layout.padding
  },
  left: {
    flex: 1,
    justifyContent: 'space-between'
  },
  main: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    padding: layout.margin
  },
  name: {
    ...typography.regular,
    ...typography.medium,
    color: colors.foreground
  },
  repo: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: layout.margin
  },
  right: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'space-between'
  },
  status: {
    borderRadius: layout.icon / 2,
    height: layout.icon / 2,
    marginLeft: layout.padding,
    width: layout.icon / 2
  },
  tag: {
    backgroundColor: colors.backgroundDark,
    borderRadius: layout.radius,
    marginLeft: layout.padding,
    padding: layout.padding / 2
  },
  tagLabel: {
    ...typography.small,
    ...typography.medium
  },
  tags: {
    flexDirection: 'row'
  }
})
