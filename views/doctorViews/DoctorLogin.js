import React from 'react';
import {Alert, Keyboard} from 'react-native';
import {Button, Center, Icon, Stack} from 'native-base';
import {api_url} from '../../config/Constants';
import axios from 'axios';
import {Input} from 'native-base';
import {useToast} from 'native-base';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const DoctorLogin = props => {
  const [state, setState] = React.useState({
    username: '',
    password: '',
    isLoading: false,
    fcm_token: global.fcm_token,
  });
  const [show, setShow] = React.useState(false);

  const toast = useToast();

  const login = async () => {
    setState({...state, isLoding: true});
    Keyboard.dismiss();
    await checkValidate();
    if (state.validation) {
      console.log(state.fcm_token);
      await axios({
        method: 'post',
        url: api_url + 'doctor/login',
        data: {
          username: state.username,
          password: state.password,
          fcm_token: state.fcm_token,
        },
      })
        .then(async response => {
          setState({...state, isLoding: false});
          if (response.data.status === 0) {
            alert(response.data.message);
          }
          await saveData(response.data);
        })
        .catch(error => {
          setState({...state, isLoding: false});
          console.log(error);
        });
    }
  };

  const checkValidate = () => {
    if (state.username == '' || state.password == '') {
      state.validation = false;
      showToast('Please fill all the fields.', 'error');
      return true;
    } else {
      state.validation = true;
      return true;
    }
  };

  const saveData = async data => {
    if (data.status == 1) {
      try {
        await AsyncStorageLib.setItem('user_id', data.result.id.toString());
        await AsyncStorageLib.setItem('id', data.result.id.toString());
        await AsyncStorageLib.setItem(
          'doctor_name',
          data.result.doctor_name.toString(),
        );
        await AsyncStorageLib.setItem('email', data.result.email.toString());
        await AsyncStorageLib.setItem(
          'phone_number',
          data.result.phone_number.toString(),
        );
        await AsyncStorageLib.setItem(
          'profile_status',
          data.result.profile_status.toString(),
        );
        await AsyncStorageLib.setItem(
          'document_update_status',
          data.result.document_update_status.toString(),
        );
        global.id = await data.result.id;
        global.doctor_name = await data.result.doctor_name;
        global.email = await data.result.email;
        global.phone_number = await data.result.phone_number;
        global.profile_status = await data.result.profile_status;
        global.document_update_status = await data.result
          .document_update_status;
        Alert.alert(
          'Success',
          'You are Logged In.',
          [{text: 'OK', onPress: () => home()}],
          {cancelable: false},
        );
      } catch (e) {
        console.log(e);
        alert('Sorry something went wrong');
      }
    } else {
      alert(result.message);
    }
  };

  const register = () => {
    props.navigation.navigate('Doctor Register');
  };

  const forgot = () => {
    props.navigation.navigate('Doctor Forgot');
  };

  const showToast = (msg, status) => {
    toast.show({
      title: msg,
      status: status,
      //  duration: Snackbar.LENGTH_SHORT,
    });
  };

  const home = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Doctor Home'}],
      }),
    );
  };

  return (
    <Center flex={1} px="3">
      <Stack space={4} width={'80%'}>
        <Input
          rounded={'lg'}
          placeholder="User Name"
          InputLeftElement={
            <Icon
              as={<FontAwesome name="user" />}
              size={5}
              ml="2"
              color="muted.400"
            />
          }
          onChangeText={TextInputValue =>
            setState({...state, username: TextInputValue})
          }
        />
        <Input
          rounded={'lg'}
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
        <Button rounded={'lg'} py={4} onPress={login} size="sm">
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

export default DoctorLogin;
