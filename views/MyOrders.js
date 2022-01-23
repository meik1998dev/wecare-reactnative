import axios from 'axios';
import {Badge, Box, FlatList, Text, View, VStack, Pressable} from 'native-base';
import React from 'react';
import {connect} from 'react-redux';
import {api_url, img_url, my_orders} from '../config/Constants';
import {
  serviceActionPending,
  serviceActionError,
  serviceActionSuccess,
} from '../actions/MyOrdersActions';
import Moment from 'moment';
import {Colors} from '../assets/Colors';
import {TouchableOpacity, Image} from 'react-native';

const MyOrders = props => {
  const [state, setState] = React.useState({
    current_status: '',
    isLoding: false,
    api_status: 0,
    orders: [],
    booking_requests: [],
  });

  React.useEffect(() => {
    getMyOrders();
  }, []);

  // booking_sync = () =>{
  //    fb.ref('/customers/'+global.id).on('value', snapshot => {
  //      my_orders();
  //    });
  //  }

  console.log(state.booking_requests);
  const getMyOrders = async () => {
    setState({...state, isLoding: true});
    props.serviceActionPending();
    await axios({
      method: 'post',
      url: api_url + my_orders,
      data: {customer_id: global.id},
    })
      .then(async response => {
        console.log(response.data);
        setState({
          ...state,
          isLoding: false,
          api_status: 1,
          orders: response.data.result.orders,
          booking_requests: response.data.result.booking_requests,
        });
        await props.serviceActionSuccess(response.data);
        if (response.data.result.length == 0) {
          setState({...state, current_status: 'No data found'});
        } else {
          setState({...state, current_status: ''});
        }
      })
      .catch(error => {
        console.log(error);
        setState({...state, isLoding: false});
        props.serviceActionError(error);
      });
  };

  const getStatus = (
    booking_status,
    booking_request_status,
    booking_status_name,
    booking_request_status_name,
  ) => {
    if (booking_status) {
      return (
        <Badge borderRadius={'lg'} p={1} colorScheme="success">
          {booking_status_name}
        </Badge>
      );
    } else {
      if (booking_request_status == 1) {
        return (
          <Badge borderRadius={'lg'} p={1} colorScheme="warning">
            {booking_request_status_name}
          </Badge>
        );
      } else if (booking_request_status == 2) {
        return (
          <Badge borderRadius={'lg'} p={1} colorScheme="success">
            {booking_request_status_name}
          </Badge>
        );
      } else {
        return (
          <Badge borderRadius={'lg'} p={1} colorScheme="error">
            {booking_request_status_name}
          </Badge>
        );
      }
    }
  };

  const navigateToOrderDetails = data => {
    props.navigation.navigate('My Booking Details', {data: data});
  };
  console.log(props.bookings);
  return (
    <View flex={1}>
      <FlatList
        pt={5}
        width={'full'}
        contentContainerStyle={{alignItems: 'center'}}
        data={props.bookings}
        renderItem={({item}) => (
          <TouchableOpacity
            style={{
              alignItems: 'center',
              width: '100%',
              height: 150,
              elevation: 5,
              marginBottom: 5,
              borderRadius: 10,
              shadowColor: 'rgba(0,0,0, .4)', // IOS
              shadowOffset: {height: 1, width: 1}, // IOS
              shadowOpacity: 1, // IOS
              shadowRadius: 1, //IOS
            }}
            onPress={() => navigateToOrderDetails(item)}>
            <Box
              height={'100%'}
              rounded={'lg'}
              flexDirection={'row'}
              alignItems={'center'}
              justifyContent={'space-evenly'}
              width={'95%'}
              backgroundColor={Colors.white}>
              <Image
                alt="img"
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 100,
                }}
                source={{
                  uri: img_url + item.profile_image,
                }}
              />
              <VStack space={2}>
                <Text>{item.doctor_name}</Text>
                <Text color={'gray.400'}>{item.title}</Text>
                {getStatus(
                  item.booking_status,
                  item.booking_request_status,
                  item.booking_status_name,
                  item.booking_request_status_name,
                )}
              </VStack>
              <VStack alignItems={'center'} space={4}>
                <Text fontWeight={'bold'} color={Colors.teal} fontSize={20}>
                  {Moment(item.start_time).format('DD MMM')}
                </Text>
                <Text>{Moment(item.start_time).format('hh:mm A')}</Text>
              </VStack>
            </Box>
          </TouchableOpacity>
        )}
      />
      {props.bookings.length == 0 && state.api_status == 1 && (
        <Text>Sorry, no appointment found</Text>
      )}
    </View>
  );
};

function mapStateToProps(state) {
  return {
    isLoding: state.myorders.isLoding,
    error: state.myorders.error,
    data: state.myorders.data,
    bookings: state.myorders.bookings,
    message: state.myorders.message,
    status: state.myorders.status,
  };
}

const mapDispatchToProps = dispatch => ({
  serviceActionPending: () => dispatch(serviceActionPending()),
  serviceActionError: error => dispatch(serviceActionError(error)),
  serviceActionSuccess: data => dispatch(serviceActionSuccess(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);
