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

import TruSDK from '@tru_id/tru-sdk-react-native'
const Edit = ({ route }) => {
  const base_url = 'https://2cb3d5b5d0a2.ngrok.io'
  const { params } = route
  const { name: usersName, phoneNumber: usersPhoneNumber } = params
  const [phoneNumber, setPhoneNumber] = useState(usersPhoneNumber)
  const [name, setName] = useState(usersName)
  const [loading, setLoading] = useState(false)

  const errorHandler = ({ title, message }) => {
    return Alert.alert(title, message, [
      {
        text: 'Close',
        onPress: () => console.log('Alert closed'),
      },
    ])
  }
  const successHandler = (value) =>
    Alert.alert('Edit Successful!', `Successfully edited ${value}`, [
      {
        text: 'Close',
      },
    ])
  const editHandler = () => {
    // check if it's the user's name that was edited
    if (name) {
      const body = { name }

      setLoading(true)

      console.log('creating SIMCheck for', body)

      try {
        const response = await fetch(`${base_url}/api/edit?value=name`, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const simCheckResult = await response.json()

        console.log(simCheckResult)
        if (simCheckResult.data.no_sim_change) {
          successHandler('name')
        } else {
          errorHandler({
            title: 'Something went wrong',
            message: 'Failed to edit name.',
          })
        }
      } catch (e) {
        setLoading(false)
        errorHandler({ title: 'Something went wrong', message: e.message })
      }
    } else if (phoneNumber) {
      const body = { phone_number: phoneNumber }

      setLoading(true)

      console.log('creating SubscriberCheck for', body)

      try {
        const response = await fetch(
          `${base_url}/api/edit?value=phone_number`,
          {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        const data = await response.json()

        console.log(data)
        // open Check URL

        await TruSDK.openCheckUrl(data.data.checkUrl)

        const resp = await fetch(
          `${base_url}/api/edit?check_id=${data.data.checkId}`,
        )

        const SubscriberCheckResult = await resp.json()

        if (
          SubscriberCheckResult.data.no_sim_change &&
          SubscriberCheckResult.data.match
        ) {
          successHandler('number')
        } else {
          errorHandler({
            title: 'Something went wrong',
            message: 'Failed to edit phone number',
          })
        }
      } catch (e) {
        setLoading(false)
        errorHandler({ title: 'Something went wrong', message: e.message })
      }
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.heading}>Edit</Text>
          {name && !phoneNumber ? (
            <TextInput
              style={styles.textInput}
              placeholder="Name"
              placeholderTextColor="#d3d3d3"
              value={name}
              editable={!loading}
              onChangeText={(value) => setName(value.replace(/\s+/g, ''))}
            />
          ) : (
            <TextInput
              style={styles.textInput}
              placeholder="Number ex. +448023432345"
              placeholderTextColor="#d3d3d3"
              keyboardType="phone-pad"
              value={phoneNumber}
              editable={!loading}
              onChangeText={(value) =>
                setPhoneNumber(value.replace(/\s+/g, ''))
              }
            />
          )}

          {loading ? (
            <ActivityIndicator
              style={styles.spinner}
              size="large"
              color="#00ff00"
            />
          ) : (
            <TouchableOpacity onPress={editHandler} style={styles.button}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    )
  }
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
    color: '#fff',
  },
})
export default Edit
