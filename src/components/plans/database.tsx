import { orderBy } from 'lodash'
import React, { FunctionComponent } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'

import { IPlanData } from '../../graphql/types'
import { useDatabasePlans } from '../../hooks'
import { colors, layout, typography } from '../../styles'
import { Separator } from '../separator'
import { Spinner } from '../spinner'

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
      ItemSeparatorComponent={Separator}
      data={orderBy(plans, 'price', 'asc')}
      renderItem={({ item }) => (
        <Pressable onPress={() => onChange(item)}>
          <DatabasePlan plan={item} />
        </Pressable>
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
  item: {
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
    ...typography.medium,
    color: colors.primary,
    marginBottom: layout.padding,
    textAlign: 'center'
  },
  price: {
    ...typography.subtitle,
    ...typography.bold,
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
