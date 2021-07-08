import React from 'react'
import { Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Home from './Home'
import Register from './Register'
import Edit from './Edit'

const Stack = createStackNavigator()

const Screens = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="Edit"
        component={Edit}
        options={({ navigation }) => ({
          headerLeft: () => (
            <Text onPress={() => navigation.goBack()}> Back </Text>
          ),
        })}
      />
    </Stack.Navigator>
  </NavigationContainer>
)
export default Screens
