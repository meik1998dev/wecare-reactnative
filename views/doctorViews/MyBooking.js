import axios from 'axios';
import {Badge, Box, FlatList, Text, View, VStack, Pressable} from 'native-base';
import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {Colors} from '../../assets/Colors';
import Moment from 'moment';
import {api_url, img_url} from '../../config/Constants';
import Loader from '../../components/Loader';

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
  console.log(state.data);
  return (
    <>
      {state.data ? (
        <View flex={1}>
          <Box p={5}>
            <Text fontSize={20} color={Colors.teal}>
              My Bookings
            </Text>
          </Box>
          <FlatList
            pt={1}
            width={'full'}
            contentContainerStyle={{alignItems: 'center', paddingBottom: 30}}
            data={state.data}
            renderItem={({item}) => (
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  width: '95%',
                  height: 150,
                  elevation: 5,
                  marginBottom: 15,
                  borderRadius: 10,
                  shadowColor: 'rgba(0,0,0, .4)', // IOS
                  shadowOffset: {height: 1, width: 1}, // IOS
                  shadowOpacity: 1, // IOS
                  shadowRadius: 1, //IOS
                }}
                onPress={() =>
                  props.navigation.navigate('Booking Details', {data: item})
                }>
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
                      uri: img_url + item.profile_picture,
                    }}
                  />
                  <VStack space={2}>
                    <Text>{item.first_name}</Text>
                    <Text color={'gray.400'}>{item.title}</Text>
                    <Badge
                      colorScheme={
                        item.booking_type === 2 ? 'warning' : 'success'
                      }>
                      {item.booking_type === 2 ? 'In place' : 'Online'}
                    </Badge>
                  </VStack>
                  <VStack alignItems={'center'} space={4}>
                    <Text fontWeight={'bold'} color={Colors.teal} fontSize={20}>
                      {Moment(item.starting_time).format('DD MMM')}
                    </Text>
                    <Text> {Moment(item.starting_time).format('hh:mm A')}</Text>
                    {/* <Text>{Moment(item.ending_time).format('hh:mm A')}</Text> */}
                  </VStack>
                </Box>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default MyBooking;
