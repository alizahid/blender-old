import anser from 'anser'
import moment from 'moment'
import React, { FunctionComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { ILogEntry } from '../../../graphql/types'
import { colors, layout, typography } from '../../../styles'

interface Props {
  log: ILogEntry
}

export const Card: FunctionComponent<Props> = ({ log }) => {
  const json = anser.ansiToJson(log.text.trim())

  return (
    <View style={styles.main}>
      <Text style={styles.time}>
        {moment(Number(log.timestamp) / 1000 / 1000).format('LLL')}
      </Text>
      <Text selectable>
        {json
          .filter(({ content }) => content)
          .map(({ content, fg }, index) => (
            <Text
              key={index}
              style={[
                styles.text,
                {
                  color: `rgb(${fg || '255, 255, 255'})`
                }
              ]}>
              {content.replace(/\(B$/, '')}
            </Text>
          ))}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: layout.margin,
    paddingVertical: layout.padding
  },
  text: {
    ...typography.codeSmall
  },
  time: {
    ...typography.small,
    color: colors.foregroundLight,
    marginBottom: layout.padding / 2
  }
})
