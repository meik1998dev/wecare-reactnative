import React, {useState, useEffect} from 'react'
import {Alert} from 'react-native'
import Loader from '../components/Loader'
import {CommonActions} from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import {Center, Input, useToast , Button} from 'native-base'
import axios from 'axios'
import {api_url} from '../config/Constants'
import AsyncStorageLib from '@react-native-async-storage/async-storage'

export function PhoneVerification(props) {
  const [confirm, setConfirm] = useState(null)

  const [code, setCode] = useState('')

  const {state} = props.route.params

  const toast = useToast()

  const [loading, setLoading] = useState(true)

  const showToast = (msg, status) => {
    toast.show({
      title: msg,
      status: status,
    })
  }

  useEffect(() => {
    signInWithPhoneNumber(state.phone_number)
  }, [])

  async function signInWithPhoneNumber(phoneNumber) {
    try {
      const confirmation = await auth().signInWithPhoneNumber(
        '+' + phoneNumber,
      )
      setConfirm(confirmation)
      setLoading(false)
    } catch (error) {
      alert(error)
      console.log(error)
      setLoading(false)
    }
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code)
      alert('success')
      register()
    } catch (error) {
      alert('Invalid code.')
    }
  }

  const register = async () => {
    setLoading(true)
    await axios({
      method: 'post',
      url: api_url + 'customer',
      data: {
        first_name: state.first_name,
        last_name: state.last_name,
        mid_name: state.mid_name,
        phone_number: state.phone_number,
        gender: state.gender,
        email: state.email,
        gov_id: state.gov_id,
        address: state.address,
        password: state.password,
        blood_group: state.blood_group,
        fcm_token: state.fcm_token,
      },
    })
      .then(async response => {
        if (response.data.status !== 0) {
          await saveData(response.data)
        } else {
          showToast(response.data.message, 'error')
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  const home = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'HomeStack'}],
      }),
    )
  }

  const saveData = async data => {
    try {
      console.log(data)
      await AsyncStorageLib.setItem('user_id', data.result.id.toString())
      await AsyncStorageLib.setItem(
        'first_name',
        data.result.first_name.toString(),
      )
      await AsyncStorageLib.setItem(
        'phone_number',
        data.result.phone_number.toString(),
      )
      await AsyncStorageLib.setItem('email', data.result.email.toString())
      global.id = await data.result.id
      global.first_name = await data.result.first_name
      global.phone_number = await data.result.phone_number
      global.email = await data.result.email
      Alert.alert('Success', 'You are registered successfully', [
        {
          text: 'OK',
          onPress: () => home(),
        },
      ])
    } catch (e) {
      console.log(e)
      console.log('error')
    }
  }

  return (
    <>
      {loading && <Loader />}
      {confirm && (
        <Center flex={1}>
          <Input mb={5} w={'50%'} fontSize={20} value={code} onChangeText={text => setCode(text)} />
          <Button size={'lg'} rounded={'lg'} onPress={() => confirmCode()} >Confirm Code</Button>
        </Center>
      )}
    </>
  )
}
