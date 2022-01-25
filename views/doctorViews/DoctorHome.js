import AsyncStorageLib from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  Badge,
  Box,
  Container,
  FlatList,
  ScrollView,
  Text,
  View,
  VStack,
} from 'native-base';
import React from 'react';
import {Alert, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from '../../assets/Colors';
import {api_url, img_url} from '../../config/Constants';
import Moment from 'moment';
import {useToast} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Loader from '../../components/Loader';

const DoctorHome = (props) => {
  const [state, setState] = React.useState({
    isLoading: false,
    doctor_id: '',
    data: [],
    bookings: [],
    api_status: 0,
  });

  const toast = useToast();

  React.useEffect(() => {
    getDetails();
    //  getProfile();
  }, []);

  const getDetails = async () => {
    const id = await AsyncStorageLib.getItem('id');
    console.log(id);
    setState({...state, isLoading: true});
    await axios({
      method: 'post',
      url: api_url + 'doctor/dashboard',
      data: {id: id},
    })
      .then(async response => {
        console.log(response.data);
        setState({
          ...state,
          isLoading: false,
          data: response.data.result,
          api_status: 1,
          bookings: response.data.result.booking_requests,
        });
      })
      .catch(error => {
        console.log(error);
        setState({...state, isLoading: false});
        alert('Sorry, something went wrong');
      });
  };

  // const getProfile = async () => {
  //   const id = await AsyncStorageLib.getItem('id');
  //   console.log(id);
  //   setState({...state, isLoading: true});
  //   await axios({
  //     method: 'post',
  //     url: api_url + 'doctor/get_profile',
  //     data: {doctor_id: id},
  //   })
  //     .then(async response => {
  //       setState({...state, isLoading: false});
  //       console.log(response.data);
  //       //   check_settings(response.data);
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       setState({...state, isLoading: false});
  //       alert('Sorry, something went wrong');
  //     });
  // };

  const check_settings = async data => {
    try {
      await AsyncStorageLib.setItem(
        'profile_status',
        data.result.profile_status.toString(),
      );
      await AsyncStorageLib.setItem(
        'document_update_status',
        data.result.document_update_status.toString(),
      );
      global.profile_status = await data.result.profile_status;
      global.document_update_status = await data.result.document_update_status;
    } catch (e) {
      alert('Sorry something went wrong');
    }
    if (
      data.result.profile_status == 0 ||
      data.result.document_update_status == 0
    ) {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Settings'}],
        }),
      );
    }
  };

  const acceptBookingRequest = async id => {
    setState({...state, isLoading: true});
    await axios({
      method: 'post',
      url: api_url + 'doctor/accept_booking',
      data: {booking_request_id: id, status: 2},
    })
      .then(async response => {
        setState({...state, isLoading: false});
        toast.show({
          title: 'Book Accepted',
          status: 'success',
          description: 'Thanks you.',
        });
        props.navigation.navigate('Booking Details', {data: id});
      })
      .catch(error => {
        setState({...state, isLoading: false});
        console.log(error);
        alert('Sorry, something went wrong');
      });
  };

  const popupActions = id => {
    Alert.alert('Choose Action', 'Accept an appointment', [
      {
        text: 'accept',
        onPress: () => {
          acceptBookingRequest(id);
        },
      },
    ]);
  };
  console.log(state.data.booking_requests);
  return (
    <>
      {!state.isLoading ? (
        <Box w={'100%'}>
          <VStack>
            <ScrollView
              w={'full'}
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <Box
                onPress={() => props.navigation.navigate('My Booking')}
                my={5}
                shadow={1}
                style={styles.card}>
                <FontAwesome name="list" size={25} color={Colors.teal} />
                <Text>Total Bookings</Text>
                <Text>{state.data.total_booking}</Text>
              </Box>
              <Box my={5} shadow={1} style={styles.card}>
                <FontAwesome name="bell" size={25} color={Colors.teal} />
                <Text>Today Pendings</Text>
                <Text>{state.data.pending_booking}</Text>
              </Box>

              <Box my={5} shadow={1} style={styles.card}>
                <FontAwesome
                  name="exclamation-triangle"
                  size={25}
                  color={Colors.teal}
                />
                <Text>For Approval</Text>
                <Text>{state.data.booking_requests_count}</Text>
              </Box>
            </ScrollView>

            <Box p={5}>
              <Text color={Colors.teal} fontWeight={'bold'}>
                Pending For Approval
              </Text>
            </Box>
            {state.bookings.length === 0 && (
              <Text alignSelf={'center'} mt={20} fontSize={16}>
                No Pending Bookings
              </Text>
            )}
            <FlatList
              data={state.bookings}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => popupActions(item.id)}
                  key={index}
                  style={styles.BookCard}>
                  <Box
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    w={'full'}>
                    <Image
                      style={{width: 75, height: 75}}
                      source={{
                        uri: img_url + item.profile_image,
                      }}
                    />
                    <Box>
                      <Text>{item.first_name}</Text>
                      <Text numberOfLines={1}>{item.title}</Text>
                      <Badge colorScheme="warning">
                        {item.booking_type === 2 ? 'In place' : 'Online'}
                      </Badge>
                    </Box>
                    <Box alignItems={'center'}>
                      <Text color={Colors.teal}>
                        {Moment(item.start_time).format('hh:mm A')}
                      </Text>
                      <Text color={Colors.teal}>
                        {Moment(item.start_time).format('DD MMM-YY')}
                      </Text>
                    </Box>
                  </Box>
                </TouchableOpacity>
              )}
            />
          </VStack>
        </Box>
      ) : (
        <Loader />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    height: 140,
    width: 160,
    padding: 20,
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  BookCard: {
    marginBottom: 20,
    backgroundColor: Colors.white,
    borderRadius: 25,
    height: 140,
    width: '90%',
    justifyContent: 'center',
    padding: 20,
    elevation: 2,
    alignSelf: 'center',
  },
});

export default DoctorHome;
