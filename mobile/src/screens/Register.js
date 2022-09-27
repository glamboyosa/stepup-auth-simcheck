import React, { useContext, useState } from 'react'

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
  Image,
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'
import TruSdkReactNative from '@tru_id/tru-sdk-react-native'

const Register = ({ navigation }) => {
  // server ngrok url
  const base_url = '{YOUR_NGROK_URL}'
  const [phoneNumber, setPhoneNumber] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const errorHandler = ({ title, message }) => {
    return Alert.alert(title, message, [
      {
        text: 'Close',
        onPress: () => console.log('Alert closed'),
      },
    ])
  }

  const registerHandler = async () => {
    const body = { phone_number: phoneNumber }

    setLoading(true)

    console.log('creating PhoneCheck for', body)

    try {
      const reachabilityResponse = await TruSdkReactNative.openWithDataCellular(
        'https://eu.api.tru.id/public/coverage/v0.1/device_ip'
      );

      console.log(reachabilityResponse);
      let isMNOSupported = false

      if ('error' in reachabilityResponse) {
        errorHandler({
          title: 'Something went wrong.',
          message: 'MNO not supported',
        })
        setLoading(false)

        return
      } else if ('http_status' in reachabilityResponse) {
        let httpStatus = reachabilityResponse.http_status;
        if (httpStatus === 200 && reachabilityResponse.response_body !== undefined) {
          let body = reachabilityResponse.response_body;
          console.log('product => ' + JSON.stringify(body.products[0]));
          isMNOSupported = true;
        } else if (httpStatus === 400 || httpStatus === 412 || reachabilityResponse.response_body !== undefined) {
          errorHandler({
            title: 'Something went wrong.',
            message: 'MNO not supported',
          })
          setLoading(false)

          return
        }
      }

      let isPhoneCheckSupported = false

      if (isMNOSupported === true) {
        reachabilityResponse.response_body.products.forEach((product) => {
          console.log('supported products are', product)

          if (product.product_name === 'Phone Check') {
            isPhoneCheckSupported = true
          }
        })
      }

      if (!isPhoneCheckSupported) {
        setLoading(false)
        errorHandler({
          title: 'Something went wrong.',
          message: 'PhoneCheck is not supported on MNO',
        })
        return
      }

      const response = await fetch(`${base_url}/api/register`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      console.log(data)

      console.log(`PhoneCheck [Start] ->`);
      const checkResponse = await TruSdkReactNative.openWithDataCellular(
        data.data.checkUrl
      );
      console.log(`PhoneCheck [Done] ->`);

      if ('error' in checkResponse) {
        console.log(`Error in openWithDataCellular: ${checkResponse.error_description}`);
      } else if ('http_status' in checkResponse) {
        const httpStatus = checkResponse.http_status;
        if (httpStatus === 200 && checkResponse.response_body !== undefined) {
          console.log(`Requesting PhoneCheck URL`);

          if ('error' in checkResponse.response_body) {
            const body = checkResponse.response_body;
            console.log(`Error: ${body.error_description}`);
          } else {
            const body = checkResponse.response_body;

            try {
              const checkStatusRes = await fetch(`${base_url}/api/exchange-code`, {
                method: 'POST',
                body: JSON.stringify({
                  check_id: body.check_id,
                  code: body.code,
                  reference_id: null,
                }),
                headers: {
                  'Content-Type': 'application/json',
                },
              })

              const data = await checkStatusRes.json()
              console.log('[CHECK RESULT]:', data);

              if (data.data.match) {
                console.log(`✅ successful PhoneCheck match`);
                setLoading(false)
                setPhoneNumber('')
                navigation.navigate('Home', {
                  phoneNumber: null,
                  name: null,
                })
              } else {
                console.log(`❌ failed PhoneCheck match`);
                setLoading(false)
                errorHandler({
                  title: 'Registration Failed',
                  message: 'PhoneCheck match failed. Please contact support',
                })
              }
            } catch (error) {
              console.log(`Error: ${error.message}`);
              console.log(JSON.stringify(error, null, 2));
              errorHandler({
                title: 'Error retrieving check result',
                message: error.message,
              })
              return;
            }
          }
        } else {
          const body = resp.response_body;
          console.log(`Error: ${body.detail}`);
        }
      }
    } catch (e) {
      setLoading(false)
      errorHandler({ title: 'Something went wrong', message: e.message })
    }
  }

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
          <Image
            style={styles.logo}
            source={require('../images/tru-logo.png')}
          />
          <Text style={styles.heading}>Register</Text>
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
          {loading ? (
            <ActivityIndicator
              style={styles.spinner}
              size="large"
              color="#00ff00"
            />
          ) : (
            <TouchableOpacity onPress={registerHandler} style={styles.button}>
              <Text style={styles.buttonText}>Register</Text>
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
  logo: {
    marginTop: 10,
    width: 0.5 * Dimensions.get('window').width,
    height: 200,
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

export default Register
