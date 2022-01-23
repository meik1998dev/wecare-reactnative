import axios from 'axios';
import {
  Container,
  Text,
  Box,
  Icon,
  ScrollView,
  VStack,
  ArrowForwardIcon,
} from 'native-base';
import React from 'react';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import {AirbnbRating, Rating} from 'react-native-ratings';
import {Colors} from '../assets/Colors';
import Loader from '../components/Loader';
import {api_url, get_doctor_by_services, img_url} from '../config/Constants';

const DoctorsList = props => {
  const [state, setState] = React.useState({
    result: [],
    api_status: 0,
    isLoding: false,
  });

  const getDoctors = async () => {
    setState({...state, isLoding: true});
    try {
      const response = await axios({
        method: 'get',
        url: api_url + 'doctors',
      });
      setState({...state, isLoding: false});
      setState({...state, result: response.data.result});
    } catch (error) {
      setState({...state, isLoding: false});
      alert('Something went wrong');
      console.log(error);
    }
  };

  React.useEffect(() => {
    getDoctors();
  }, []);

  return (
    <>
      {state.isLoding ? (
        <Loader />
      ) : (
        <VStack p={5}>
          <Box>
            <Text fontSize={20} color={Colors.teal}>
              Choose a doctor
            </Text>
          </Box>
          {state.result ? (
            <ScrollView
              contentContainerStyle={{alignItems: 'center'}}
              w={'full'}
              pt={5}>
              {state.result.map(
                ({
                  doctor_name,
                  profile_image,
                  specialist,
                  overall_rating,
                  id,
                }) => (
                  <Box
                    shadow={2}
                    flexDirection={'row'}
                    style={styles.doctorCard}
                    key={id}>
                    <Image
                      alt="pic"
                      style={{
                        width: 100,
                        height: 100,
                        marginRight: 20,
                        borderRadius: 100,
                      }}
                      resizeMode="cover"
                      source={{
                        uri: img_url + profile_image,
                      }}></Image>
                    <VStack space={2} flexBasis={'55%'}>
                      <Text>{doctor_name}</Text>
                      <Text color={'gray.500'} fontSize={12}>
                        {specialist}ertertert
                      </Text>
                      <AirbnbRating
                        ratingBackgroundColor={Colors.yellow}
                        size={15}
                        count={5}
                        defaultRating={overall_rating}
                        isDisabled={true}
                        showRating={false}
                        ratingContainerStyle={{
                          width: '52%',
                          marginLeft: 0,
                        }}
                      />
                    </VStack>

                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('Create Appointment', {
                          doctor_id: id,
                          type: props.route.params.type,
                        })
                      }
                      flexBasis={'10%'}>
                      <ArrowForwardIcon style={styles.arrowIcon} />
                    </TouchableOpacity>
                  </Box>
                ),
              )}
            </ScrollView>
          ) : (
            <Text>xx</Text>
          )}
        </VStack>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  doctorCard: {
    backgroundColor: Colors.white,
    width: '99%',
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
    height: 150,
    alignItems: 'center',
  },
  arrowIcon: {
    backgroundColor: Colors.vintage,
    color: Colors.white,
    borderRadius: 100,
    padding: 10,
  },
});

export default DoctorsList;
