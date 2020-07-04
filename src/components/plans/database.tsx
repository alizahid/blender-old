import { orderBy } from 'lodash'
import React, { FunctionComponent } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'

import { IPlanData } from '../../graphql/types'
import { useDatabasePlans } from '../../hooks'
import { colors, layout, shadow, typography } from '../../styles'
import { Spinner } from '../spinner'
import { Touchable } from '../touchable'

interface Props {
  onChange: (plan: IPlanData) => void
}

export const DatabasePlans: FunctionComponent<Props> = ({ onChange }) => {
  const { loading, plans } = useDatabasePlans()

  if (loading) {
    return <Spinner full />
  }

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={orderBy(plans, 'price', 'asc')}
      renderItem={({ item }) => (
        <Touchable onPress={() => onChange(item)}>
          <DatabasePlan plan={item} />
        </Touchable>
      )}
    />
  )
}

interface DatabasePlanProps {
  plan: IPlanData
}

export const DatabasePlan: FunctionComponent<DatabasePlanProps> = ({
  plan
}) => (
  <View style={styles.item}>
    <Text style={styles.name}>{plan.name}</Text>
    <View style={styles.row}>
      <Text style={styles.left}>RAM</Text>
      <Text style={styles.right}>{plan.mem}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.left}>CPU</Text>
      <Text style={styles.right}>
        {plan.cpu.includes('m') ? 'Shared' : plan.cpu}
      </Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.left}>STORAGE</Text>
      <Text style={styles.right}>{plan.size}</Text>
    </View>
    <Text style={styles.price}>${plan.price}/month</Text>
  </View>
)

const styles = StyleSheet.create({
  content: {
    paddingVertical: layout.padding
  },
  item: {
    ...shadow,
    backgroundColor: colors.background,
    borderRadius: layout.radius,
    marginHorizontal: layout.margin,
    marginVertical: layout.padding,
    padding: layout.margin
  },
  left: {
    ...typography.small,
    ...typography.medium,
    color: colors.foregroundLight,
    flex: 1,
    marginRight: layout.padding,
    textAlign: 'right'
  },
  name: {
    ...typography.regular,
    color: colors.primary,
    marginBottom: layout.padding,
    textAlign: 'center'
  },
  price: {
    ...typography.subtitle,
    marginTop: layout.margin,
    textAlign: 'center'
  },
  right: {
    ...typography.small,
    ...typography.medium,
    color: colors.foregroundLight,
    flex: 1,
    marginLeft: layout.padding,
    textAlign: 'left'
  },
  row: {
    flexDirection: 'row',
    marginTop: layout.padding
  }
})
