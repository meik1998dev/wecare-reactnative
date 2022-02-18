import axios from 'axios'
import { Box, Button, Text, View, VStack } from 'native-base'
import React from 'react'
import { Colors } from '../assets/Colors'
import { api_url, booking_details, doctorthree, img_url } from '../config/Constants'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Moment from 'moment'
import { Image } from 'react-native'

const MyBookingDetails = (props) => {
  const [state, setState] = React.useState({
    isLoading: false,
    data: props.route.params.data,
  })
  React.useEffect(() => {
    getBookingDetails()
  }, [])
  console.log(state)
  const getBookingDetails = async () => {
    await axios({
      method: 'post',
      url: api_url + booking_details,
      data: { id: state.data.id },
    })
      .then(async (response) => {
        setState({ ...state, data: response.data.result })
      })
      .catch((error) => {
        console.log(error)
        alert('Sorry something went wrong')
      })
  }
  console.log(state)

  const navigateToChat = () => {
    props.navigation.navigate('Chat', { data: state.data })
  }

  const navigateToVideo = () => {
    props.navigation.navigate('Video', { booking_id: state.data.booking_id })
  }
  console.log(state.data.booking_type)

  return (
    <Box w={'100%'}>
      <View>
        <Image
          alt="img"
          opacity={0.6}
          backgroundColor={'gray.700'}
          style={{ alignSelf: 'center', height: 180, width: '100%' }}
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
            uri: img_url + state.data.profile_image,
          }}
        />
      </View>
      <VStack space={5} mt={-4} zIndex={-1} alignItems={'center'}>
        <Box shadow={2} rounded={'lg'} width={'95%'} h={145} p={3} backgroundColor={Colors.white}>
          <Text mb={5} color={Colors.teal} fontWeight={'bold'} fontSize={17}>
            Doctor Informations
          </Text>
          <Box justifyContent={'space-between'} flexDirection={'row'}>
            <Box>
              <Box alignItems={'center'} mb={4} flexDirection={'row'}>
                <FontAwesome
                  style={{ paddingRight: 5 }}
                  name="user"
                  size={20}
                  color={Colors.teal}
                />
                <Text>Dr. {state.data.doctor_name}</Text>
              </Box>
              <Box alignItems={'center'} flexDirection={'row'}>
                <FontAwesome
                  style={{ paddingRight: 5 }}
                  name="mobile"
                  size={20}
                  color={Colors.teal}
                />
                <Text>{state.data.phone_number}</Text>
              </Box>
            </Box>
            <Box alignItems={'center'} mb={10} flexDirection={'row'}>
              <FontAwesome
                style={{ paddingRight: 5 }}
                name="envelope"
                size={20}
                color={Colors.teal}
              />
              <Text>{state.data.email}</Text>
            </Box>
          </Box>
        </Box>
        <Box shadow={2} rounded={'lg'} width={'95%'} h={95} p={3} backgroundColor={Colors.white}>
          <Text fontSize={19} fontWeight={'bold'} mb={5}>
            {state.data.title}
          </Text>
          <Text>{state.data.description}</Text>
        </Box>
        <Box shadow={2} rounded={'lg'} width={'95%'} h={195} p={3} backgroundColor={Colors.white}>
          <Text fontSize={19} fontWeight={'bold'} mb={5}>
            Booking Information
          </Text>
          <Box px={3} flexDirection={'row'} justifyContent={'space-between'}>
            <Box>
              <Box mb={4} flexDirection={'row'} alignItems={'center'}>
                <FontAwesome
                  style={{ paddingRight: 10 }}
                  name="clock-o"
                  size={20}
                  color={Colors.teal}
                />
                <Box>
                  <Text>Booking Time</Text>
                  <Text>{Moment(state.data.start_time).format('hh:mm A')}</Text>
                </Box>
              </Box>
              <Box flexDirection={'row'} alignItems={'center'}>
                <FontAwesome
                  style={{ paddingRight: 10 }}
                  name="hospital-o"
                  size={20}
                  color={Colors.teal}
                />
                <Box>
                  <Text>Booking Type</Text>
                  {state.data.booking_type == 1 ? (
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
                  style={{ paddingRight: 10 }}
                  name="calendar"
                  size={20}
                  color={Colors.teal}
                />
                <Box>
                  <Text>Booking Date</Text>
                  <Text>{Moment(state.data.start_time).format('DD MMM-YYYY')}</Text>
                </Box>
              </Box>
              <Box flexDirection={'row'} alignItems={'center'}>
                <FontAwesome
                  style={{ paddingRight: 10 }}
                  name="id-badge"
                  size={20}
                  color={Colors.teal}
                />
                <Box>
                  <Text>Booking Id</Text>
                  <Text>#{state.data.id}</Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        {state.data.booking_type === 1 && state.data.booking_request_status !== 1 && (
          <Box mt={-38} flexDirection={'row'} justifyContent={'space-around'} w={'full'}>
            <Button onPress={navigateToChat} shadow="2" alignItems={'center'} py={4} rounded="xl">
              <Box w={20} justifyContent={'space-around'} flexDirection={'row'}>
                <FontAwesome name="comments" size={20} color="white" />
                <Text fontWeight={'bold'} color={Colors.white}>
                  Chat
                </Text>
              </Box>
            </Button>
            <Button
              onPress={navigateToVideo}
              alignItems={'center'}
              shadow="2"
              colorScheme={'secondary'}
              py={4}
              rounded="xl"
            >
              <Box w={20} justifyContent={'space-around'} flexDirection={'row'}>
                <FontAwesome name="video-camera" size={20} color="white" />
                <Text fontWeight={'bold'} color={'white'}>
                  Video
                </Text>
              </Box>
            </Button>
          </Box>
        )}
      </VStack>
    </Box>
  )
}

export default MyBookingDetails
