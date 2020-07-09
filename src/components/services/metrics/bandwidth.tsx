import moment from 'moment'
import prettyBytes from 'pretty-bytes'
import React, { FunctionComponent } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { LineChart, XAxis, YAxis } from 'react-native-svg-charts'

import { IBandwidth } from '../../../graphql/types'
import { colors, layout, typography } from '../../../styles'

interface Props {
  bandwidth: IBandwidth
}

export const Bandwidth: FunctionComponent<Props> = ({ bandwidth }) => {
  const { width } = Dimensions.get('window')

  const x = bandwidth.points.slice(-5).map(({ time }) => moment(time).valueOf())
  const y = bandwidth.points.slice(-5).map(({ bandwidthMB }) => bandwidthMB)

  return (
    <View style={styles.main}>
      <View style={styles.header}>
        <Text style={styles.title}>Bandwidth</Text>
        <Text style={styles.total}>
          {prettyBytes(bandwidth.totalMB * 1024)} this month
        </Text>
      </View>
      <View style={styles.chart}>
        <View>
          <LineChart
            contentInset={{
              bottom: layout.margin,
              left: layout.margin,
              right: layout.margin,
              top: layout.margin
            }}
            data={y}
            style={{
              height: width * 0.5,
              width: width - layout.margin * 5
            }}
            svg={{
              stroke: colors.primary,
              strokeWidth: layout.border * 2
            }}
            yMax={bandwidth.totalMB * 1024}
            yMin={0}
          />
          <XAxis
            contentInset={{
              left: layout.margin * 2,
              right: layout.margin * 2
            }}
            data={x}
            formatLabel={(value) => `${moment(x[value]).format('HH:mm')}`}
            svg={{
              fill: colors.foregroundLight,
              fontSize: typography.tiny.fontSize
            }}
          />
        </View>
        <YAxis
          contentInset={{
            bottom: layout.margin,
            top: layout.margin
          }}
          data={y}
          formatLabel={(value) => prettyBytes(value)}
          max={bandwidth.totalMB * 1024}
          min={0}
          numberOfTicks={3}
          svg={{
            fill: colors.foregroundLight,
            fontSize: typography.tiny.fontSize
          }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  chart: {
    backgroundColor: colors.backgroundDark,
    borderRadius: layout.radius,
    flexDirection: 'row',
    marginTop: layout.margin,
    paddingBottom: layout.margin
  },
  header: {
    flexDirection: 'row'
  },
  main: {
    padding: layout.margin
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground,
    flex: 1
  },
  total: {
    ...typography.regular,
    ...typography.medium
  }
})
