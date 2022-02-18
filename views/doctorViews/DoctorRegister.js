import React from 'react'
import {ScrollView, Keyboard} from 'react-native'
import {CommonActions} from '@react-navigation/native'
import {
    Button,
    useToast,
    Text,
    Input,
    Stack,
    Center,
} from 'native-base'
import {api_url} from '../../config/Constants'
import axios from 'axios'
import {Colors} from '../../assets/Colors'

const DoctorRegister = props => {
    const [state, setState] = React.useState({
        title: 'Your Info',
        validation: false,
        doctor_name: '',
        qualification: '',
        email: '',
        username: '',
        password: '',
        isLoding: false,
        fcm_token: global.fcm_token,
        phone_number: '',
    })

    const toast = useToast()

    const showToast = (msg, status) => {
        toast.show({
            title: msg,
            status: status,
        })
    }

    const login = () => {
        props.navigation.navigate('Doctor Login')
    }

    const home = () => {
        props.navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{name: 'Doctor Home'}],
            }),
        )
    }
  
    const register = async () => {
        Keyboard.dismiss()
        checkValidate()
        if (state.validation) {
            await axios({
                method: 'post',
                url: api_url + 'doctor/check_credentials',
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
                    if (response.data.status !== '0') {
                        props.navigation.navigate('Doctor Phone Verify' , {state: state})
                    }
                    else {
                        showToast(response.data.message, 'error')
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }

    const checkValidate = () => {
        if (
            state.email == '' ||
      state.phone_number == '' ||
      state.password == '' ||
      state.doctor_name == '' ||
      state.qualification == '' ||
      state.username == ''
        ) {
            state.validation = false
            showToast('Please fill all the fields.', 'error')
            return true
        } else {
            state.validation = true
            return true
        }
    }

    return (
        <ScrollView>
            <Text p={5} fontSize={20} color={Colors.teal}>
        Register
            </Text>
            <Center flex={1} pt={10} p={10}>
                {/* <View>
         <StatusBar />
      </View>
      <Loader visible={isLoding} /> */}
                <Stack flex={1} w={'full'} space={3}>
                    <Input
                        rounded={'lg'}
                        placeholder="Doctor Name"
                        onChangeText={TextInputValue =>
                            setState({...state, doctor_name: TextInputValue})
                        }
                    />
                    <Input
                        rounded={'lg'}
                        placeholder="Qualification"
                        onChangeText={TextInputValue =>
                            setState({...state, qualification: TextInputValue})
                        }
                    />
                    <Input
                        rounded={'lg'}
                        placeholder="Phone Number"
                        keyboardType="phone-pad"
                        onChangeText={TextInputValue =>
                            setState({...state, phone_number: TextInputValue})
                        }
                    />
                    <Input
                        rounded={'lg'}
                        placeholder="Email Address"
                        keyboardType="email-address"
                        onChangeText={TextInputValue =>
                            setState({...state, email: TextInputValue})
                        }
                    />
                    <Input
                        rounded={'lg'}
                        placeholder="User Name"
                        onChangeText={TextInputValue =>
                            setState({...state, username: TextInputValue})
                        }
                    />

                    <Input
                        rounded={'lg'}
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={TextInputValue =>
                            setState({...state, password: TextInputValue})
                        }
                    />

                    <Button rounded={'lg'} py={4} onPress={register}>
            Submit
                    </Button>
                    <Text onPress={login}>
            Already have an account? <Text>Login here</Text>
                    </Text>
                </Stack>
            </Center>
        </ScrollView>
    )
}

export default DoctorRegister
