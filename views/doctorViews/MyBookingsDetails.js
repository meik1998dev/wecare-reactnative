import React, {Component} from 'react';
import axios from 'axios';
import Moment from 'moment';
import {Box, Button, Container, Text, View, VStack} from 'native-base';
import {Colors} from '../../assets/Colors';
import {api_url, booking_details, doctorthree} from '../../config/Constants';
import {Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default class BookingRequest extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      isLoading: false,
      data: this.props.route.params.data,
      new_status: undefined,
    };
    // this.get_new_status();
  }

  onStarRatingPress(rating) {
    this.setState({
      starCount: rating,
    });
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  get_new_status = async () => {
    this.setState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + 'doctor/get_new_status',
      data: {booking_id: this.state.data.id, status: this.state.data.status},
    })
      .then(async response => {
        if (response.data.status) {
          let data = this.state.data;
          data.new_status = response.data.result.id;
          data.new_status_name = response.data.result.status_name;
          console.log(response.data.result);
          await this.setState({
            isLoading: false,
            data: data,
            new_status: response.data.result.id,
          });
        }
      })
      .catch(error => {
        this.setState({isLoading: false});
        console.log(error);
        alert('Sorry, something went wrong');
      });
  };

  status_change = async status => {
    this.setState({isLoading: true});
    await axios({
      method: 'post',
      url: api_url + status_change,
      data: {booking_id: this.state.data.id, status: status},
    })
      .then(async response => {
        let data = await this.state.data;
        data.status = await response.data.result;
        await this.setState({isLoading: false, data: data});
        await this.get_new_status();
      })
      .catch(error => {
        this.setState({isLoading: false});
        console.log(error);
        alert('Sorry, something went wrong');
      });
  };

  write_prescription = async () => {
    this.props.navigation.navigate('Prescription', {data: this.state.data});
  };

  chat = () => {
    this.props.navigation.navigate('Doctor Chat', {data: this.state.data});
  };

  video = () => {
    this.props.navigation.navigate('DoctorVideo', {
      booking_id: this.state.data.id,
    });
  };

  render() {
    return (
      <Box w={'100%'}>
        <View>
          <Image
            alt="img"
            opacity={0.6}
            backgroundColor={'gray.700'}
            style={{alignSelf: 'center', height: 180, width: '100%'}}
            source={doctorthree}
          />
          <Image
            alt="img"
            style={{
              alignSelf: 'center',
              width: 90,
              height: 90,
              marginTop: -55,
              borderRadius: 100,
            }}
            source={{
              uri: 'https://i.pinimg.com/564x/85/5d/f2/855df22700990ca085d87970f354054f.jpg',
            }}
          />
        </View>
        <VStack space={5} mt={-4} zIndex={-1} alignItems={'center'}>
          <Box
            shadow={2}
            rounded={'lg'}
            width={'95%'}
            h={145}
            p={3}
            backgroundColor={Colors.white}>
            <Text mb={5} color={Colors.teal} fontWeight={'bold'} fontSize={17}>
              Customer Informations
            </Text>
            <Box justifyContent={'space-between'} flexDirection={'row'}>
              <Box>
                <Box alignItems={'center'} mb={4} flexDirection={'row'}>
                  <FontAwesome
                    style={{paddingRight: 5}}
                    name="user"
                    size={20}
                    color={Colors.teal}
                  />
                  <Text> {this.state.data.first_name}</Text>
                </Box>
                <Box alignItems={'center'} flexDirection={'row'}>
                  <FontAwesome
                    style={{paddingRight: 5}}
                    name="mobile"
                    size={20}
                    color={Colors.teal}
                  />
                  <Text>{this.state.data.phone_number}</Text>
                </Box>
              </Box>
              <Box alignItems={'center'} mb={10} flexDirection={'row'}>
                <FontAwesome
                  style={{paddingRight: 5}}
                  name="envelope"
                  size={20}
                  color={Colors.teal}
                />
                <Text>{this.state.data.email}</Text>
              </Box>
            </Box>
          </Box>
          <Box
            shadow={2}
            rounded={'lg'}
            width={'95%'}
            h={95}
            p={3}
            backgroundColor={Colors.white}>
            <Text fontSize={19} fontWeight={'bold'} mb={5}>
              {this.state.data.title}
            </Text>
            <Text>{this.state.data.description}</Text>
          </Box>
          <Box
            shadow={2}
            rounded={'lg'}
            width={'95%'}
            h={195}
            p={3}
            backgroundColor={Colors.white}>
            <Text fontSize={19} fontWeight={'bold'} mb={5}>
              Booking Information
            </Text>
            <Box px={3} flexDirection={'row'} justifyContent={'space-between'}>
              <Box>
                <Box mb={4} flexDirection={'row'} alignItems={'center'}>
                  <FontAwesome
                    style={{paddingRight: 10}}
                    name="clock-o"
                    size={20}
                    color={Colors.teal}
                  />
                  <Box>
                    <Text>Booking Time</Text>
                    <Text>
                      {Moment(this.state.data.starting_time).format('hh:mm A')}
                    </Text>
                  </Box>
                </Box>
                <Box flexDirection={'row'} alignItems={'center'}>
                  <FontAwesome
                    style={{paddingRight: 10}}
                    name="hospital-o"
                    size={20}
                    color={Colors.teal}
                  />
                  <Box>
                    <Text>Booking Type</Text>
                    {this.state.data.booking_type == 1 ? (
                      <Text>Online consultation</Text>
                    ) : (
                      <Text>Direct appointment</Text>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box>
                <Box mb={4} flexDirection={'row'} alignItems={'center'}>
                  <FontAwesome
                    style={{paddingRight: 10}}
                    name="calendar"
                    size={20}
                    color={Colors.teal}
                  />
                  <Box>
                    <Text>Booking Date</Text>
                    <Text>
                      {Moment(this.state.data.ending_time).format(
                        'DD MMM-YYYY',
                      )}
                    </Text>
                  </Box>
                </Box>
                <Box flexDirection={'row'} alignItems={'center'}>
                  <FontAwesome
                    style={{paddingRight: 10}}
                    name="id-badge"
                    size={20}
                    color={Colors.teal}
                  />
                  <Box>
                    <Text>Booking Id</Text>
                    <Text>#{this.state.data.id}</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            mt={-38}
            flexDirection={'row'}
            justifyContent={'space-around'}
            w={'full'}>
            <Button
              //   onPress={navigateToChat}
              shadow="2"
              alignItems={'center'}
              py={4}
              rounded="xl"
              onPress={this.chat}>
              <Box w={20} justifyContent={'space-around'} flexDirection={'row'}>
                <FontAwesome name="comments" size={20} color="white" />
                <Text fontWeight={'bold'} color={Colors.white}>
                  Chat
                </Text>
              </Box>
            </Button>
            <Button
              onPress={this.video}
              alignItems={'center'}
              shadow="2"
              colorScheme={'secondary'}
              py={4}
              rounded="xl">
              <Box w={20} justifyContent={'space-around'} flexDirection={'row'}>
                <FontAwesome name="video-camera" size={20} color="white" />
                <Text fontWeight={'bold'} color={'white'}>
                  Video
                </Text>
              </Box>
            </Button>
          </Box>
        </VStack>
      </Box>
    );
  }
}
