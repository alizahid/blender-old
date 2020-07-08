import moment from 'moment'
import React, { FunctionComponent } from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import { BarChart, Grid, XAxis } from 'react-native-svg-charts'

import { IDisk } from '../../../graphql/types'
import { colors, layout, typography } from '../../../styles'

interface Props {
  disk: IDisk
}

export const Metrics: FunctionComponent<Props> = ({ disk }) => {
  const { width } = Dimensions.get('window')

  const x = disk.metrics.map(({ time }) => moment(time).valueOf())
  const y = disk.metrics.map(({ usedBytes }) =>
    Math.round(usedBytes / 1024 / 1024)
  )

  return (
    <View style={styles.main}>
      <Text style={styles.title}>Disk usage</Text>
      <View style={styles.chart}>
        <BarChart
          contentInset={{
            bottom: layout.margin,
            left: layout.margin,
            right: layout.margin,
            top: layout.margin
          }}
          data={y}
          style={{
            height: width * 0.5,
            width: width - layout.margin * 2
          }}
          svg={{
            fill: colors.primary
          }}
          yMax={disk.sizeGB * 1024}
          yMin={0}>
          <Grid
            svg={{
              stroke: colors.border
            }}
          />
        </BarChart>
        <XAxis
          contentInset={{
            left: layout.margin * 2,
            right: layout.margin * 2
          }}
          data={x}
          formatLabel={(value) => `${moment(x[value]).format('MMM D')}`}
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
    marginTop: layout.margin,
    paddingBottom: layout.margin
  },
  main: {
    padding: layout.margin
  },
  title: {
    ...typography.subtitle
  }
})
