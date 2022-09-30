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
import TruSdkReactNative from '@tru_id/tru-sdk-react-native'

const Edit = ({ route, navigation }) => {
  const base_url = '{YOUR_NGROK_URL}'

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
  
  const editHandler = async () => {
    // check if it's the user's name that was edited
    if (name && usersPhoneNumber) {
      const body = { name, phone_number: usersPhoneNumber }
  
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
  
        if (!simCheckResult.data.simChanged) {
          setLoading(false)
          successHandler('name')
        } else {
          setLoading(false)
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
      const body = { phone_number: phoneNumber.trim() }
  
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

        if (!data.data) {
          setLoading(false)

          errorHandler({
            title: 'Something went wrong',
            message: 'Number not supported',
          })

          return
        }

        // open Check URL
        await TruSDK.check(data.data.checkUrl)

        // pass the new phone number and old phone number as query params
        const resp = await fetch(
          `${base_url}/api/edit?check_id=${data.data.checkId}&old_phone_number=${usersPhoneNumber.trim()}&new_phone_number=${phoneNumber.trim()}`,
        )

        const subscriberCheckResult = await resp.json()

        if (resp.status !== 200) {
          setLoading(false)

          errorHandler({
            title: 'Something went wrong',
            message: 'Failed to edit phone number',
          })

          return
        }

        if (resp.status !== 200) {
          setLoading(false)

          errorHandler({
            title: 'Something went wrong',
            message: 'Failed to edit phone number',
          })

          return
        }

        if (
          subscriberCheckResult.data.no_sim_change &&
          subscriberCheckResult.data.match
        ) {
          setLoading(false)
          successHandler('number')
        } else {
          setLoading(false)
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
  }

  const successHandler = (value) =>
    Alert.alert(
      'Successful!',
      `Successfully ${usersName ? 'added' : 'edited'} ${value}`,
      [
        {
          text: 'Close',
          onPress: () => {
            value === 'name'
              ? navigation.navigate({
                  name: 'Home',
                  params: { name },
                  merge: true,
                })
              : navigation.navigate({
                  name: 'Home',
                  params: { phoneNumber },
                  merge: true,
                })
          },
        },
      ],
    )

  return (
    <LinearGradient
      colors={['rgba(25, 85, 255, 40)', 'rgba(10, 10, 50, 66)']}
      useAngle={true}
      angle={0}
      style={{
        flex: 1,
      }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.heading}>Edit</Text>
          {name || (typeof name !== 'undefined' && phoneNumber) ? (
            <TextInput
              style={styles.textInput}
              placeholder="Name"
              placeholderTextColor="#d3d3d3"
              value={name}
              editable={!loading}
              onChangeText={(value) => setName(value)}
            />
          ) : (
            <TextInput
              style={styles.textInput}
              placeholder="Number ex. +448023432345"
              placeholderTextColor="#d3d3d3"
              keyboardType="phone-pad"
              value={phoneNumber}
              editable={!loading}
              onChangeText={(value) => setPhoneNumber(value.replace(/\s+/g, ''))}
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
              <Text style={styles.buttonText}>{usersName ? 'Edit' : 'Add'}</Text>
            </TouchableOpacity>
          )}
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
    borderColor: '#858585',
    borderWidth: 0.4,
    elevation: 7,
    shadowColor: '#858585',
    shadowOffset: { width: 0.5, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    color: '#000',
    width: 0.7 * Dimensions.get('window').width,
  },
  spinner: {
    marginTop: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1955ff',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#1955ff',
    marginTop: 17,
    width: '40%',
  },
  buttonText: {
    color: '#fff',
  },
})

export default Edit
