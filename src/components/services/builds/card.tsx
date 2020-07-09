import moment from 'moment'
import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Image from 'react-native-fast-image'

import {
  img_events_build_cancelled,
  img_events_build_failed,
  img_events_build_started,
  img_events_build_succeeded
} from '../../../assets'
import { IBuild } from '../../../graphql/types'
import { colors, layout, typography } from '../../../styles'

interface Props {
  build: IBuild
}

export const Card: FunctionComponent<Props> = ({ build }) => (
  <View style={styles.main}>
    <Image
      source={
        build.status === 2
          ? img_events_build_succeeded
          : build.status === 3
          ? img_events_build_failed
          : build.status === 4
          ? img_events_build_cancelled
          : img_events_build_started
      }
      style={styles.icon}
    />
    <View style={styles.content}>
      <Text style={styles.message}>
        Build{' '}
        {build.status === 2
          ? 'succeeded'
          : build.status === 3
          ? 'failed'
          : build.status === 4
          ? 'cancelled'
          : 'started'}
      </Text>
      <Text style={styles.time}>{moment(build.createdAt).format('LLL')}</Text>
    </View>
  </View>
)

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginLeft: layout.margin
  },
  icon: {
    height: layout.icon * 2,
    width: layout.icon * 2
  },
  main: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: layout.margin
  },
  message: {
    ...typography.regular,
    color: colors.foreground
  },
  time: {
    ...typography.small,
    color: colors.foregroundLight,
    marginTop: layout.padding
  }
})
