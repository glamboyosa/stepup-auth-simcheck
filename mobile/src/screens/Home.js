import React from 'react'

import { SafeAreaView, View, Text, StyleSheet } from 'react-native'

import LinearGradient from 'react-native-linear-gradient'

const Home = ({ route, navigation }) => {
  const { params } = route
  const { name, phoneNumber } = params
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
        <Text style={styles.heading}>Home 🏡</Text>
        <View style={styles.list}>
          <Text style={styles.content}>{name}</Text>
        </View>
        <View style={styles.list}>
          <Text style={styles.content}>{phoneNumber}</Text>
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
    height: 0.7 * Dimensions.get('window').height,
    padding: 15,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
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
    backgroundColor: '#00ff7f',
    color: '#000',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 10,
    width: '25%',
  },
  buttonText: {
    color: '#000',
  },
})
export default Home
