import axios from 'axios';
import {Badge, Box, FlatList, Text, View, VStack, Pressable} from 'native-base';
import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {Colors} from '../../assets/Colors';
import Moment from 'moment';
import {api_url, img_url} from '../../config/Constants';

const MyBooking = props => {
  const [state, setState] = React.useState({});

  React.useEffect(() => {
    getMyBookings();
  }, []);

  const getMyBookings = async () => {
    await axios({
      method: 'post',
      url: api_url + 'doctor/get_bookings',
      data: {doctor_id: global.id},
    })
      .then(async response => {
        console.log(response.data.result);
        setState({
          data: response.data.result,
          isLoding: false,
          api_status: 1,
        });
      })
      .catch(error => {
        console.log(error);
        setState({...state, isLoding: false});
      });
  };
  console.log(state);
  return (
    <View flex={1}>
      {state.data ? (
        <FlatList
          pt={5}
          width={'full'}
          contentContainerStyle={{alignItems: 'center'}}
          data={state.data}
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
              onPress={() => props.navigation.navigate('Booking Details' , {data : item}) }>
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
                    uri: img_url+item.profile_picture,
                  }}
                />
                <VStack space={2}>
                  <Text>{item.first_name}</Text>
                  <Text color={'gray.400'}>{item.title}</Text>
                  {/* {getStatus(
                    item.booking_status,
                    item.booking_request_status,
                    item.booking_status_name,
                    item.booking_request_status_name,
                  )} */}
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
      ) : (
        <Text>Sorry, no appointment found</Text>
      )}
    </View>
  );
};

export default MyBooking;
