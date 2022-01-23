import React from 'react';
import {StyleSheet, Keyboard, Alert} from 'react-native';
import {Button, Center, Icon, Stack} from 'native-base';
import {api_url, login_url} from '../config/Constants';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
} from '../actions/LoginActions';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {CommonActions} from '@react-navigation/native';
import {Input} from 'native-base';
import {useToast} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../assets/Colors';

export const Login = props => {
  const [state, setState] = React.useState({
    email: '',
    validation: true,
    isLoding: false,
    fcm_token: global.fcm_token,
    password: '',
  });
  const [show, setShow] = React.useState(false);

  const toast = useToast();

  const login = async () => {
    setState({...state, isLoding: true});
    Keyboard.dismiss();
    await checkValidate();
    if (state.validation) {
      props.serviceActionPending();
      console.log(state.fcm_token);
      await axios({
        method: 'post',
        url: api_url + login_url,
        data: {
          email: state.email,
          password: state.password,
          fcm_token: state.fcm_token,
        },
      })
        .then(async response => {
          setState({...state, isLoding: false});
          await props.serviceActionSuccess(response.data);
          console.log(response.data);
          await saveData(response.data);
        })
        .catch(error => {
          setState({...state, isLoding: false});
          console.log(error);
          alert(error);
          props.serviceActionError(error);
        });
    }
  };

  const checkValidate = () => {
    if (state.email == '' || state.password == '') {
      state.validation = false;
      showToast('Please fill all the fields.', 'error');
      return true;
    } else {
      state.validation = true;
      return true;
    }
  };

  const saveData = async data => {
    try {
      await AsyncStorageLib.setItem('user_id', data.result.id.toString());
      await AsyncStorageLib.setItem(
        'first_name',
        data.result.first_name.toString(),
      );
      await AsyncStorageLib.setItem(
        'phone_number',
        data.result.phone_number.toString(),
      );
      await AsyncStorageLib.setItem('email', data.result.email.toString());
      global.id = data.result.id;
      global.first_name = data.result.first_name;
      global.phone_number = data.result.phone_number;
      global.email = data.result.email;
      Alert.alert(
        'Success',
        'You are logged in',
        [
          {
            text: 'OK',
            onPress: () =>
              props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'HomeStack'}],
                }),
              ),
          },
        ],
        {cancelable: false},
      );
    } catch (e) {
      console.log(e);
      console.log('err');
    }
  };
  console.log(global.id);

  const register = () => {
    props.navigation.navigate('Register');
  };

  const forgot = () => {
    props.navigation.navigate('Forgot');
  };

  const showToast = (msg, status) => {
    toast.show({
      title: msg,
      status: status,
      //  duration: Snackbar.LENGTH_SHORT,
    });
  };

  return (
    <Center flex={1} px="3">
      <Stack space={4} width={'80%'}>
        <Input
          placeholder="Email Address"
          InputLeftElement={
            <Icon
              as={<FontAwesome name="envelope" />}
              size={5}
              ml="2"
              color="muted.400"
            />
          }
          keyboardType="email-address"
          onChangeText={TextInputValue =>
            setState({...state, email: TextInputValue})
          }
        />
        <Input
          placeholder="Password"
          type={show ? 'text' : 'password'}
          InputRightElement={
            <Icon
              as={<FontAwesome name="eye-slash" />}
              size={5}
              onPress={() => setShow(!show)}
              mr="2"
              color={!show ? 'muted.300' : 'primary.400'}
            />
          }
          onChangeText={TextInputValue =>
            setState({...state, password: TextInputValue})
          }
        />
        <Button py={4} onPress={login} size="sm">
          Login
        </Button>
        {/* <Button
          fontWeight="bold"
          colorScheme="dark"
          onPress={forgot}
          size="md"
          variant="ghost">
          Forgot Password?
        </Button> */}
        <Button
          fontWeight="bold"
          colorScheme="secondary"
          onPress={register}
          size="md"
          variant="ghost">
          Sign up for a new account ?
        </Button>
      </Stack>
    </Center>
  );
};

function mapStateToProps(state) {
  return {
    isLoding: state.login.isLoding,
    error: state.login.error,
    data: state.login.data,
    message: state.login.message,
    status: state.login.status,
  };
}

const mapDispatchToProps = dispatch => ({
  serviceActionPending: () => dispatch(serviceActionPending()),
  serviceActionError: error => dispatch(serviceActionError(error)),
  serviceActionSuccess: data => dispatch(serviceActionSuccess(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
const styles = StyleSheet.create({});
