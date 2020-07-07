import color from 'color'
import React, { FunctionComponent } from 'react'
import { RefreshControl, RefreshControlProps } from 'react-native'

import { colors } from '../styles'

const tintColor = color(colors.primary).lighten(0.5).hex()

export const Refresher: FunctionComponent<RefreshControlProps> = (props) => (
  <RefreshControl {...props} tintColor={tintColor} />
)
