import React from 'react'
import { StyleSheet, Text, Keyboard } from 'react-native'
// import { MaterialIcons } from '@expo/vector-icons';
import { Button, useToast, Input, Center, Stack } from 'native-base'
import { api_url, forgot } from '../config/Constants'
import axios from 'axios'
import { connect } from 'react-redux'
import {
    serviceActionPending,
    serviceActionError,
    serviceActionSuccess,
} from '../actions/ForgotActions'

export const Forgot = (props) => {
    const [state, setState] = React.useState({
        email: '',
        validation: true,
        isModalVisible: false,
        isLoding: false,
    })
    const toast = useToast()

    const forgot_password = async () => {
        setState({ isLoding: true })
        Keyboard.dismiss()
        await checkValidate()
        if (state.validation) {
            props.serviceActionPending()
            await axios({
                method: 'post',
                url: api_url + forgot,
                data: { email: state.email },
            })
                .then(async (response) => {
                    setState({ isLoding: false })
                    await props.serviceActionSuccess(response.data)
                    await otp(response.data.result.id)
                })
                .catch((error) => {
                    setState({ isLoding: false })
                    props.serviceActionError(error)
                })
        }
    }

    const otp = (id) => {
        if (props.status == 1) {
            props.navigation.navigate('Otp', { id: id })
        } else {
            alert(props.message)
        }
    }

    const checkValidate = () => {
        if (state.email == '') {
            state.validation = false
            showToast('Please enter email address', 'error')
            return true
        }
    }

    const showToast = (msg, status) => {
        toast.show({
            title: msg,
            status: status,
            //  duration: Snackbar.LENGTH_SHORT,
        })
    }

    return (
        <Center flex={1} px={3}>
            <Stack space={5} width={'80%'}>
                {/* <View>
            <StatusBar />
         </View>
         <Loader visible={isLoding} />
         <Loader visible={state.isLoding} /> */}
                <Text>
               We just need your registered E-Mail Address to send you a reset
               code
                </Text>

                <Input
                    placeholder='Email Address'
                    // InputLeftElement={
                    //    <Icon
                    //       as={<MaterialIcons name='mail' />}
                    //       size={5}
                    //       ml='2'
                    //       color='muted.400'
                    //    />
                    // }
                    keyboardType='email-address'
                    onChangeText={(TextInputValue) =>
                        setState({ ...state, email: TextInputValue })
                    }
                />

                <Button py={4} onPress={forgot_password}>Send</Button>
            </Stack>
        </Center>
    )
}

function mapStateToProps(state) {
    return {
        isLoding: state.forgot.isLoding,
        error: state.forgot.error,
        data: state.forgot.data,
        message: state.forgot.message,
        status: state.forgot.status,
    }
}

const mapDispatchToProps = (dispatch) => ({
    serviceActionPending: () => dispatch(serviceActionPending()),
    serviceActionError: (error) => dispatch(serviceActionError(error)),
    serviceActionSuccess: (data) => dispatch(serviceActionSuccess(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Forgot)
const styles = StyleSheet.create({})
