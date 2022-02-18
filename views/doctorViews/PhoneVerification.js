import React, {useState, useEffect} from 'react'
import {Alert} from 'react-native'
import Loader from '../../components/Loader'
import {CommonActions} from '@react-navigation/native'
import auth from '@react-native-firebase/auth'
import {Center, Input, useToast, Button, Text} from 'native-base'
import axios from 'axios'
import {api_url} from '../../config/Constants'
import AsyncStorageLib from '@react-native-async-storage/async-storage'

export function DoctorPhoneVerification(props) {
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
      url: api_url + 'doctor/register',
      data: {
        doctor_name: state.doctor_name,
        qualification: state.qualification,
        email: state.email,
        phone_number: state.phone_number,
        username: state.username,
        password: state.password,
        fcm_token: global.fcm_token,
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
        routes: [{name: 'Doctor Home'}],
      }),
    )
  }

  const saveData = async data => {
    try {
      await AsyncStorageLib.setItem('id', data.result.id.toString())
      await AsyncStorageLib.setItem(
        'doctor_name',
        data.result.doctor_name.toString(),
      )
      await AsyncStorageLib.setItem(
        'qualification',
        data.result.qualification.toString(),
      )
      await AsyncStorageLib.setItem(
        'phone_number',
        data.result.phone_number.toString(),
      )
      await AsyncStorageLib.setItem('email', data.result.email.toString())
      await AsyncStorageLib.setItem(
        'profile_status',
        data.result.profile_status.toString(),
      )
      await AsyncStorageLib.setItem(
        'document_update_status',
        data.result.document_update_status.toString(),
      )
      global.doctor_name = await data.result.doctor_name
      global.qualification = await data.result.qualification
      global.phone_number = await data.result.phone_number
      global.email = await data.result.email
      global.id = await data.result.id
      global.profile_status = await data.result.profile_status
      global.document_update_status = await data.result.document_update_status
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
          <Text mb={2}>Enter code you received</Text>
          <Input
            mb={5}
            w={'50%'}
            fontSize={20}
            value={code}
            onChangeText={text => setCode(text)}
          />
          <Button size={'lg'} rounded={'lg'} onPress={() => confirmCode()}>
            Confirm Code
          </Button>
          <Button
            fontWeight="bold"
            colorScheme="secondary"
            onPress={() => signInWithPhoneNumber(state.phone_number)}
            size="md"
            variant="ghost">
            resend code
          </Button>
        </Center>
      )}
    </>
  )
}
