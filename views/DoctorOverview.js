import { Box, Button, Text, View } from 'native-base'
import React, { useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Image } from 'react-native'
import { Colors } from '../assets/Colors'
import { img_url, doctorthree } from '../config/Constants'

export function DoctorOverview(props) {
  const [doctorInfo] = useState(props.route.params.data)
  console.log(doctorInfo)
  return (
    <>
      <View>
        <Image
          alt="img"
          opacity={0.6}
          backgroundColor="gray.700"
          style={{ alignSelf: 'center', height: 180, width: '100%' }}
          source={doctorthree}
        />
        <Image
          alt="img"
          resizeMode="cover"
          style={{
            alignSelf: 'center',
            width: 200,
            height: 200,
            marginTop: -105,
            borderRadius: 100,
          }}
          source={{
            uri: img_url + doctorInfo.profile_image,
          }}
        />
      </View>
      <Box w={'100%'} alignItems="center" flexDirection="column" mt={10}>
        <Box shadow={2} rounded="lg" width="95%" py={10} p={3} backgroundColor={Colors.white}>
          <Text mb={5} color={Colors.teal} fontWeight="bold" fontSize={17}>
            Doctor Informations
          </Text>
          <Box justifyContent="space-between" flexDirection="row">
            <Box>
              <Box alignItems="center" mb={4} flexDirection="row">
                <FontAwesome
                  style={{ paddingRight: 5 }}
                  name="user"
                  size={20}
                  color={Colors.teal}
                />
                <Text>
                  Dr.
                  {doctorInfo.doctor_name}
                </Text>
              </Box>
              <Box alignItems="center" flexDirection="row">
                <FontAwesome
                  style={{ paddingRight: 5 }}
                  name="mobile"
                  size={20}
                  color={Colors.teal}
                />
                <Text>{doctorInfo.phone_number}</Text>
              </Box>
            </Box>
            <Box alignItems="center" mb={10} flexDirection="row">
              <FontAwesome
                style={{ paddingRight: 5 }}
                name="envelope"
                size={20}
                color={Colors.teal}
              />
              <Text>{doctorInfo.email}</Text>
            </Box>
          </Box>
          <Box flexDirection={'row'} justifyContent={'space-between'} mt={10}>
            <Box>
              <Text my={7}>
                Description: <Text fontWeight={700}>{doctorInfo.description}</Text>
              </Text>
              <Text>
                Experience: <Text fontWeight={700}>{doctorInfo.experience}</Text>
              </Text>
            </Box>
            <Box>
              <Text my={7}>
                Qualification: <Text fontWeight={700}>{doctorInfo.qualification}</Text>
              </Text>
              <Text>
                Specialist: <Text fontWeight={700}>{doctorInfo.specialist}</Text>
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box mt={20} flexDirection={'row'} justifyContent={'space-around'} w={'full'}>
        <Button
          onPress={() =>
            props.navigation.navigate('Create Appointment', {
              doctor_id: doctorInfo.id,
              type: 1,
            })
          }
          shadow="2"
          py={4}
          rounded="xl"
          size="lg"
        >
          Book Online
        </Button>
        <Button
          onPress={() =>
            props.navigation.navigate('Create Appointment', {
              doctor_id: doctorInfo.id,
              type: 2,
            })
          }
          shadow="2"
          colorScheme={'secondary'}
          py={4}
          rounded="xl"
          size="lg"
        >
          Book In Place
        </Button>
      </Box>
    </>
  )
}
