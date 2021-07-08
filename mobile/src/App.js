import 'react-native-gesture-handler'

import React from 'react'

import Screens from './screens'

import LinearGradient from 'react-native-linear-gradient'
const App = () => (
  <LinearGradient
    colors={['rgba(253,161, 114,23)', 'rgba(242, 82, 120,92)']}
    useAngle={true}
    angle={0}
    style={{
      flex: 1,
    }}
  >
    <Screens />
  </LinearGradient>
)

export default App
