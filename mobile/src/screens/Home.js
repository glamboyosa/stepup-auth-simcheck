import React from 'react'
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native'

import LinearGradient from 'react-native-linear-gradient'

const Home = ({ route, navigation }) => {
  const { params } = route
  const { name, phoneNumber } = params

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
          <Text style={styles.heading}>Home 🏡</Text>

          <View>
            <Text style={styles.label}>Name</Text>
            <View style={styles.list}>
              <TextInput
                style={styles.textInput}
                placeholder="No name yet"
                placeholderTextColor="#d3d3d3"
                value={name}
                editable={false}
              />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Edit', {
                    name,
                    phoneNumber,
                  })
                }
                style={styles.button}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.list}>
              <TextInput
                style={styles.textInput}
                placeholder="Number ex. +448023432345"
                placeholderTextColor="#d3d3d3"
                value={phoneNumber}
                editable={false}
              />

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Edit', {
                    phoneNumber,
                  })
                }
                style={styles.button}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    height: 0.6 * Dimensions.get('window').height,
    padding: 15,
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
    width: 0.5 * Dimensions.get('window').width,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    color: 'grey',
    fontSize: 10,
  },
  list: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  content: {
    fontSize: 20,
    marginRight: 25,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1955ff',
    borderColor: '#1955ff',
    marginTop: -15,
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    width: '25%',
  },
  buttonText: {
    color: '#fff',
  },
})

export default Home
