import AsyncStorageLib from '@react-native-async-storage/async-storage'
import React from 'react'
import { useEffect } from 'react'
import { Text } from 'react-native'

export const Auth = (props) => {
  useEffect(() => {
    const getIdFromStorage = async () => {
      try {
        const first_name = await AsyncStorageLib.getItem('first_name')
        const doctor_name = await AsyncStorageLib.getItem('doctor_name')
        const user_id = await AsyncStorageLib.getItem('user_id')

        if (first_name) {
          global.id = user_id
          global.first_name = first_name
          props.navigation.navigate('HomeStack')
        } 
        else if(doctor_name){
          global.id = user_id
          global.first_name = doctor_name
          props.navigation.navigate('Doctor Home')
        }
        else {
          console.log('was nothing')
          props.navigation.navigate('Splash')
        }
      } catch (error) {
        console.log(error)
      }
    }
    getIdFromStorage()
  }, [])

  return <Text>Auth</Text>
}
