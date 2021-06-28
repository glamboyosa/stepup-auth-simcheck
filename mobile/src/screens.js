import React, { useContext, useState } from 'react'

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'
import { AuthContext } from './context'

const Screens = () => {
  const { screen } = useContext(AuthContext)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  return (
    <LinearGradient
      colors={['rgba(253,161, 114,23.6)', 'rgba(242, 82, 120,92)']}
      useAngle={true}
      angle={0}
      style={{
        flex: 1,
      }}
    >
      {screen === 'register' ? (
        <SafeAreaView style={styles.container}>
          <View style={styles.box}>
            <Text style={styles.heading}>Register</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Number ex. +448023432345"
              placeholderTextColor="#d3d3d3"
              keyboardType="phone-pad"
              value={phoneNumber.Value}
              editable={!loading}
              onChangeText={(value) =>
                setPhoneNumber(value.replace(/\s+/g, ''))
              }
            />
          </View>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.container}>
          <View style={styles.box}>
            <Text style={styles.heading}>Login</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Number ex. +448023432345"
              placeholderTextColor="#d3d3d3"
              keyboardType="phone-pad"
              value={phoneNumber.Value}
              editable={!loading}
              onChangeText={(value) =>
                setPhoneNumber(value.replace(/\s+/g, ''))
              }
            />
          </View>
        </SafeAreaView>
      )}
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '50%',
    borderRadius: 3,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0.5, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 0.7 * Dimensions.get('window').height,
    padding: 1.5,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    padding: 1.5,
    borderRadius: 3,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0.5, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    color: '#000',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00ff7f',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 10,
  },
})

export default Screens
