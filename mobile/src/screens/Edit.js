import React, { useState } from 'react'

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'


const Edit = ({ route }) => {
  const base_url = 'https://serverngrokurl.ngrok.io'
  const { params } = route
  const { name: usersName, phoneNumber: usersPhoneNumber } = params
 
    return (
        <LinearGradient
      colors={['rgba(253,161, 114,23)', 'rgba(242, 82, 120,92)']}
      useAngle={true}
      angle={0}
      style={{
        flex: 1,
      }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.heading}>Edit</Text>
        </View>
      </SafeAreaView>
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
    width: '90%',
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
    padding: 15,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textInput: {
    padding: 15,
    borderRadius: 3,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 0.4,
    elevation: 7,
    width: 0.7 * Dimensions.get('window').width,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0.5, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    color: '#000',
  },
  spinner: {
    marginTop: 12,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00ff7f',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 14,
    width: '40%',
  },
  buttonText: {
    color: '#000',
  },
})
export default Edit
