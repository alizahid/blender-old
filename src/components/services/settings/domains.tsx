import React, { FunctionComponent } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Image from 'react-native-fast-image'

import { img_ui_dark_copy, img_ui_dark_open_link } from '../../../assets'
import { ICustomDomain, IServer } from '../../../graphql/types'
import { useServiceCertificate } from '../../../hooks'
import { browser, clipboard } from '../../../lib'
import { colors, layout, typography } from '../../../styles'
import { KeyValue } from '../../key-value'
import { Spinner } from '../../spinner'

interface Props {
  domains: ICustomDomain[]
  server: IServer
}

export const Domains: FunctionComponent<Props> = ({ domains, server }) => (
  <View style={styles.main}>
    <Text style={styles.title}>Domains</Text>
    <KeyValue
      actions={[
        {
          icon: img_ui_dark_copy,
          onPress: () => clipboard.set(server.url)
        },
        {
          icon: img_ui_dark_open_link,
          onPress: () => browser.open(server.url)
        }
      ]}
      label="Primary"
      style={styles.item}
      value={server.url.replace('https://', '')}
    />
    {domains.map((domain) => (
      <Domain domain={domain} key={domain.id} server={server} />
    ))}
  </View>
)

interface DomainProps {
  domain: ICustomDomain
  server: IServer
}

const Domain: FunctionComponent<DomainProps> = ({ domain, server }) => {
  const { certificate, loading } = useServiceCertificate(server.id, domain.name)

  const url = `${certificate?.issued ? 'https' : 'http'}://${domain.name}`

  return (
    <View style={styles.domain}>
      <View style={styles.details}>
        <Text style={styles.name}>{domain.name}</Text>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.label}>
              {domain.verified ? 'Verified' : 'Not verified'}
            </Text>
          </View>
          {loading ? (
            <Spinner style={styles.spinner} />
          ) : (
            <View style={styles.tag}>
              <Text style={styles.label}>
                {certificate?.issued
                  ? 'Certificate issued'
                  : 'Certificate pending'}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable onPress={() => clipboard.set(url)} style={styles.action}>
          <Image source={img_ui_dark_copy} style={styles.icon} />
        </Pressable>
        <Pressable onPress={() => browser.open(url)} style={styles.action}>
          <Image source={img_ui_dark_open_link} style={styles.icon} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  action: {
    marginLeft: layout.padding
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 'auto'
  },
  details: {
    flex: 1
  },
  domain: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: layout.margin
  },
  icon: {
    height: layout.icon,
    margin: layout.padding,
    opacity: 0.5,
    width: layout.icon
  },
  item: {
    marginTop: layout.margin
  },
  label: {
    ...typography.small,
    color: colors.foregroundLight
  },
  main: {
    padding: layout.margin
  },
  name: {
    ...typography.regular
  },
  spinner: {
    marginHorizontal: layout.padding
  },
  tag: {
    backgroundColor: colors.backgroundDark,
    borderRadius: layout.radius,
    marginLeft: layout.padding,
    padding: layout.padding / 2
  },
  tags: {
    flexDirection: 'row',
    marginLeft: -layout.padding,
    marginTop: layout.padding
  },
  title: {
    ...typography.subtitle,
    color: colors.foreground
  }
})
