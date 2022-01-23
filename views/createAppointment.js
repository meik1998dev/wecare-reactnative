import {
  Box,
  Button,
  Center,
  Container,
  Icon,
  Input,
  Text,
  VStack,
} from 'native-base';
import React from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';
// import { EvilIcons } from '@expo/vector-icons';
import {Colors} from '../assets/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Alert, StyleSheet} from 'react-native';
import axios from 'axios';
import {
  api_url,
  check_available_timing,
  create_booking,
} from '../config/Constants';

const createAppointment = props => {
  const [state, setState] = React.useState({
    description: '',
    title: '',
    deliveryDatePickerVisible: false,
    delivery_date: '',
    delivery_time: '',
    start_time: '',
    doctor_id: props.route.params.doctor_id,
    type: 1,
    price_per_conversation: 150,
    isLoding: false,
  });

  console.log(props.route.params.type);

  console.log(state.doctor_id);
  const createBooking = async () => {
    setState({...state, isLoding: true});
    console.log(state);
    await axios({
      method: 'post',
      url: api_url + create_booking,
      data: {
        patient_id: global.id,
        doctor_id: state.doctor_id,
        booking_type: props.route.params.type,
        start_time: state.start_time,
        call_duration: '150',
        payment_mode: 2,
        total_amount: 110,
        title: state.title,
        description: state.description,
      },
    })
      .then(async response => {
        setState({...state, isLoding: false});
        if (response.data.status == 0) {
          alert(response.data.message);
        } else {
          setState({
            ...state,
            title: '',
            description: '',
            start_time: '',
          });
        }

        if (response.data.status == 1) {
          Alert.alert(
            'Success',
            'Your order has been successfully placed.',
            [{text: 'OK', onPress: () => navigateToMyOrders()}],
            {cancelable: false},
          );
        }
      })
      .catch(error => {
        alert('something went wrong');
        console.log(error);
        setState({...state, isLoding: false});
      });
  };

  const check_timing = async () => {
    setState({isLoding: true});
    await axios({
      method: 'post',
      url: api_url + check_available_timing,
      data: {
        doctor_id: state.doctor_id,
        start_time: state.start_time,
        booking_type: state.type,
      },
    })
      .then(async response => {
        setState({isLoding: false});
        if (response.data.status == 0) {
          alert(response.data.message);
        } else {
          createBooking();
        }
      })
      .catch(error => {
        console.log(error);
        alert('something went wrong');
        setState({isLoding: false});
      });
  };

  const navigateToMyOrders = () => {
    props.navigation.navigate('My Orders');
  };

  const onPay = async () => {
    await RNPayFort({
      command: 'PURCHASE',
      access_code: 'xxxxxxxxxxxxxxxxxx',
      merchant_identifier: 'xxxxxxxxxx',
      sha_request_phrase: 'xxxxxxxxxxxxxxxxxx',
      amount: 100,
      currencyType: 'SAR',
      language: 'en',
      email: 'naishadh@logisticinfotech.co.in',
      testing: true,
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const make_payment = () => {
    var options = {
      currency: global.currency_short_code,
      key: global.razorpay_key,
      amount: state.price_per_conversation * 100,
      name: global.application_name,
      prefill: {
        email: global.email,
        contact: global.phone_number,
        name: global.customer_name,
      },
      theme: {color: colors.theme_fg},
    };
    // RazorpayCheckout.open(options)
    //    .then(() => {
    //       createBooking();
    //    })
    //    .catch((error) => {
    //       alert('Your transaction declined');
    //    });
  };

  const showDeliveryDatePicker = () => {
    setState({...state, deliveryDatePickerVisible: true});
  };

  const hideDeliveryDatePicker = () => {
    setState({...state, deliveryDatePickerVisible: false});
  };

  const handleDeliveryDatePicked = async date => {
    var d = new Date(date);
    let delivery_date =
      d.getDate() +
      '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      '-' +
      d.getFullYear();
    let hr = d.getHours();
    let min = d.getMinutes();
    if (min < 10) {
      min = '0' + min;
    }
    let ampm = 'AM';
    if (hr > 12) {
      hr -= 12;
      ampm = 'PM';
    }
    let delivery_time = hr + ':' + min + ' ' + ampm;

    let start_time = delivery_date + ' ' + delivery_time;
    setState({
      ...state,
      start_time: start_time,
      delivery_date: delivery_date,
      deliveryDatePickerVisible: false,
      delivery_time: delivery_time,
    });
  };

  return (
    <VStack space={5} px={5} py={35}>
      <Box
        rounded="xl"
        flexDirection={'column'}
        justifyContent={'space-evenly'}
        shadow={3}
        style={styles.appintCard}>
        <Text color={Colors.teal}>Title</Text>
        <Input
          rounded="xl"
          width={'full'}
          placeholder="I have viral fever last two days..."
          onChangeText={TextInputValue =>
            setState({...state, title: TextInputValue})
          }
        />
      </Box>
      <Box
        rounded="xl"
        flexDirection={'column'}
        justifyContent={'space-evenly'}
        shadow={3}
        style={styles.appintCard}>
        <Text fontWeight={'bold'} color={Colors.teal}>
          Description
        </Text>
        <Input
          width={'full'}
          rounded="xl"
          placeholder="Write short description..."
          onChangeText={TextInputValue =>
            setState({...state, description: TextInputValue})
          }
        />
      </Box>
      <Box
        rounded="xl"
        flexDirection={'row'}
        justifyContent={'space-evenly'}
        shadow={3}
        style={styles.appintCard}>
        <Button
          rounded="xl"
          colorScheme={'secondary'}
          py={3}
          px={5}
          onPress={showDeliveryDatePicker}>
          <Center>
            {/* <EvilIcons
                     style={{ color: Colors.white, paddingBottom: 0 }}
                     name='calendar'
                     size={28}
                     color='black'
                  /> */}
            <FontAwesome
              style={{color: Colors.white, paddingBottom: 0}}
              name="calendar-o"
              size={28}
            />
          </Center>
        </Button>
        <Text color={'gray.500'}>
          {state.start_time ? state.start_time : 'Pick date please'}
        </Text>
        <DateTimePicker
          isVisible={state.deliveryDatePickerVisible}
          onConfirm={handleDeliveryDatePicked}
          onCancel={hideDeliveryDatePicker}
          minimumDate={new Date()}
          mode="datetime"
        />
      </Box>
      <Button
        onPress={check_timing}
        mt={7}
        rounded="xl"
        px={10}
        py={4}
        size={'lg'}
        shadow={2}>
        Confirm
      </Button>
    </VStack>
  );
};

const styles = StyleSheet.create({
  appintCard: {
    backgroundColor: Colors.white,
    width: '99%',
    padding: 10,
    height: 140,
    alignItems: 'center',
  },
});

export default createAppointment;

// The main details needed are:

// 1- Merchant profile ID (profile_id)
// 2- Item cost (cart_amount)
// 3- Currency (cart_currency): Must be 3 Character ISO currency code
// 4- Description (cart_description)
// 5- Unique order reference (cart_id)
// 6- Either the callback URL (callback) or the return URL (return) for your store (these URLs will only be used if the transaction required any form of browser redirection)
// 7- Transaction Type (tran_type)
