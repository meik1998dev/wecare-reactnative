import React from 'react';
import {View, StyleSheet, ScrollView, Keyboard, Alert} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {
  Icon,
  Button,
  useToast,
  Text,
  Input,
  Select,
  CheckIcon,
  Stack,
  Container,
  Center,
} from 'native-base';
import {api_url, get_blood_list, register_url} from '../config/Constants';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
} from '../actions/RegisterActions';
import {Colors} from '../assets/Colors';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

export const Register = props => {
  const [state, setState] = React.useState({
    first_name: '',
    mid_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    gov_id: '',
    password: '',
    blood_group: '',
    validation: true,
    gender: '',
    address: '',
    blood_group: '',
    fcm_token: global.fcm_token,
  });

  const [bloodList, setBloodList] = React.useState([]);

  const toast = useToast();

  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const showToast = (msg, status) => {
    toast.show({
      title: msg,
      status: status,
      //  duration: Snackbar.LENGTH_SHORT,
    });
  };

  React.useEffect(() => {
    fetchBloodList();
  }, []);

  const login = () => {
    props.navigation.navigate('Login');
  };

  const home = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'HomeStack'}],
      }),
    );
  };

  const register = async () => {
    Keyboard.dismiss();
    checkValidate();
    if (state.validation) {
      props.serviceActionPending();
      await axios({
        method: 'post',
        url: api_url + register_url,
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
            await saveData(response.data);
          } else {
            showToast(response.data.message, 'error');
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const fetchBloodList = async data => {
    const res = await axios({
      method: 'get',
      url: api_url + get_blood_list,
    });
    setBloodList(res.data.result);
  };

  const saveData = async data => {
    try {
      console.log(data);
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
      global.id = await data.result.id;
      global.first_name = await data.result.first_name;
      global.phone_number = await data.result.phone_number;
      global.email = await data.result.email;
      console.log(global.email);
      Alert.alert(
        'Success',
        'Your are registered successfully .',
        [{text: 'OK', onPress: () => home()}],
        {cancelable: false},
      );
    } catch (e) {
      console.log(e);
      console.log('error');
    }
  };

  const checkValidate = () => {
    if (
      state.email == '' ||
      state.phone_number == '' ||
      state.password == '' ||
      state.blood_group == '' ||
      state.first_name == '' ||
      state.last_name == ''
    ) {
      state.validation = false;
      showToast('Please fill all the fields.', 'error');
      return true;
    } else {
      state.validation = true;
      return true;
    }
  };

  return (
    <ScrollView>
      <Text p={5} fontSize={20} color={Colors.teal}>
        Register
      </Text>
      <Center pt={2} p={10}>
        {/* <View>
            <StatusBar />
         </View>
         <Loader visible={isLoding} /> */}
        <Stack space={3}>
          <Input
            placeholder="First Name"
            onChangeText={TextInputValue =>
              setState({...state, first_name: TextInputValue})
            }
          />
          <Input
            placeholder="Midel Name"
            onChangeText={TextInputValue =>
              setState({...state, mid_name: TextInputValue})
            }
          />
          <Input
            placeholder="Last Name"
            onChangeText={TextInputValue =>
              setState({...state, last_name: TextInputValue})
            }
          />
          <Input
            placeholder="Phone Number"
            keyboardType="phone-pad"
            onChangeText={TextInputValue =>
              setState({...state, phone_number: TextInputValue})
            }
          />
          <Input
            placeholder="Email Address"
            keyboardType="email-address"
            onChangeText={TextInputValue =>
              setState({...state, email: TextInputValue})
            }
          />
          <Input
            placeholder="Gov ID"
            maxLength={10}
            onChangeText={TextInputValue =>
              setState({...state, gov_id: TextInputValue})
            }
          />
          {bloodList && (
            <Select
              minWidth="200"
              selectedValue={state.blood_group}
              placeholder="Blood Group"
              onValueChange={itemValue =>
                setState({...state, blood_group: itemValue})
              }>
              {bloodList.map(item => (
                <Select.Item
                  key={item.id}
                  label={item.blood_group}
                  value={item.blood_group}
                />
              ))}
            </Select>
          )}

          <Select
            onValueChange={itemValue => setState({...state, gender: itemValue})}
            minWidth="200"
            placeholder="Gender"
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size="5" />,
            }}
            selectedValue={state.gender}>
            <Select.Item key={1} label="Male" value="male" />
            <Select.Item key={2} label="Female" value="female" />
          </Select>
          {/* {showDatePicker && (
                  <DateTimePicker
                     value={state.brith_date}
                     is24Hour={true}
                     display='default'
                     mode='date'
                     onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || state.brith_date;
                        setState({ ...state, brith_date: currentDate });
                     }}
                  />
               )} */}

          {/* <Input
                  placeholder='Birth date'
                  rightElement={
                     <Icon
                        as={
                           <MaterialIcons
                              name='date-range'
                              onPress={() => setShowDatePicker(true)}
                           />
                        }
                        size={5}
                        mr='2'
                        color='muted.400'
                     />
                  }
                  value={state.brith_date.toString()}
               />
             */}
          <Input
            placeholder="Address"
            onChangeText={TextInputValue =>
              setState({...state, address: TextInputValue})
            }
          />
          <Input
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={TextInputValue =>
              setState({...state, password: TextInputValue})
            }
          />
          {/* <Input
                  placeholder='Confirm Password'
                  secureTextEntry={true}
                  onChangeText={(TextInputValue) =>
                     setState({ password: TextInputValue })
                  }
               /> */}

          <Button py={4} onPress={register}>
            Submit
          </Button>
          <Text style={styles.reg_style35} onPress={login}>
            Already have an account?{' '}
            <Text style={styles.reg_style36}>Login here</Text>
          </Text>
        </Stack>
      </Center>
    </ScrollView>
  );
};

function mapStateToProps(state) {
  return {
    isLoding: state.register.isLoding,
    error: state.register.error,
    data: state.register.data,
    message: state.register.message,
    status: state.register.status,
  };
}

const mapDispatchToProps = dispatch => ({
  serviceActionPending: () => dispatch(serviceActionPending()),
  serviceActionError: error => dispatch(serviceActionError(error)),
  serviceActionSuccess: data => dispatch(serviceActionSuccess(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);

const styles = StyleSheet.create({});
