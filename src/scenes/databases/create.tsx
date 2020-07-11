import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FunctionComponent, useState } from 'react'

import { img_ui_dark_check } from '../../assets'
import { Empty, Header, HeaderButton, Spinner } from '../../components'
import { Form } from '../../components/databases'
import { DatabasePlans } from '../../components/plans'
import { IDatabaseType, IPlanData } from '../../graphql/types'
import {
  useAllRegions,
  useCreateDatabase,
  useNewPaidServiceAllowed
} from '../../hooks'
import { DatabasesParamList } from '../../navigators/databases'
import { useAuth } from '../../store'

interface Props {
  navigation: StackNavigationProp<DatabasesParamList, 'CreateDatabase'>
  route: RouteProp<DatabasesParamList, 'CreateDatabase'>
}

export const CreateDatabase: FunctionComponent<Props> = ({
  navigation: { replace, setOptions }
}) => {
  const [{ user }] = useAuth()

  const { allowed, loading } = useNewPaidServiceAllowed()
  const { loading: fetching, regions } = useAllRegions()

  const { create, loading: creating } = useCreateDatabase()

  const [plan, setPlan] = useState<IPlanData>()

  if (loading || fetching) {
    return <Spinner full />
  }

  if (!allowed) {
    return (
      <Empty message="You need to add payment details to add paid services." />
    )
  }

  if (!plan) {
    return <DatabasePlans onChange={(plan) => setPlan(plan)} />
  }

  return (
    <Form
      onChangePlan={() => setPlan(undefined)}
      onUpdate={(data) =>
        setOptions({
          header: (props) => (
            <Header
              {...props}
              loading={creating}
              right={
                data.name ? (
                  <HeaderButton
                    icon={img_ui_dark_check}
                    onPress={async () => {
                      const response = await create({
                        databaseName: data.databaseName,
                        databaseUser: data.databaseUser,
                        name: String(data.name),
                        ownerId: String(user),
                        plan: plan.name,
                        region: data.region,
                        type: IDatabaseType.Postgresql,
                        version: '10.x'
                      })

                      if (response.data?.createDatabase.id) {
                        replace('Database', {
                          id: response.data.createDatabase.id
                        })
                      }
                    }}
                  />
                ) : undefined
              }
            />
          )
        })
      }
      plan={plan}
      regions={regions}
    />
  )
}
