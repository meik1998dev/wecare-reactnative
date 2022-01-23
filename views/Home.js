import React from 'react';
import {View, ScrollView, Image} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {Box, VStack, Text, Button} from 'native-base';
import messaging from '@react-native-firebase/messaging';
import {home_details, api_url, img_url} from '../config/Constants';
import axios from 'axios';
import Loader from '../components/Loader';
import {Colors} from '../assets/Colors';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

const Home = props => {
  const [state, setState] = React.useState({
    isLoding: true,
    banners: [],
    category: [],
    doctors: [],
  });
  console.log(global.first_name);
  React.useEffect(() => {
    fetchHomeData();
    getToken();
  }, []);

  const getToken = async () => {
    //get the messeging token

    let fcmToken = await AsyncStorageLib.getItem('fcmToken');
    if (!fcmToken) {
      let fcmToken = await messaging().getToken();
      if (fcmToken) {
        try {
          AsyncStorageLib.setItem('fcmToken', fcmToken);
          global.fcm_token = fcmToken;
        } catch (e) {
          console.log(e);
        }
      }
    } else {
      global.fcm_token = fcmToken;
    }
  };

  const fetchHomeData = async () => {
    try {
      const res = await axios({
        method: 'post',
        url: api_url + home_details,
      });
      if (res.data.message === 'Success') {
        setState({
          ...state,
          isLoding: false,
          banners: res.data.result.banners,
          category: res.data.result.categories,
          doctors: res.data.result.doctors,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const _renderBannerItem = ({item, index}) => {
    return (
      <Box
        style={{
          backgroundColor: Colors.white,
          borderRadius: 5,
          padding: 50,
          height: 120,
          marginTop: 10
        }}>
        <Image
          style={{width: '100%', height: '100%'}}
          source={{uri: img_url + item.url}}
        />
      </Box>
    );
  };

  const _renderCategoriesItem = ({item, index}) => {
    return (
      <Box
        shadow={1}
        style={{
          backgroundColor: Colors.white,
          borderRadius: 100,
          height: 140,
          padding: 10,
          alignItems: 'center',
          justifyContent: 'space-around',
          marginVertical: 3,
        }}>
        <Image
          style={{width: 70, height: 70, borderRadius: 100}}
          alt="cat"
          source={{uri: img_url + item.category_image}}></Image>
        <Text>{item.category_name}</Text>
      </Box>
    );
  };

  console.log(state);

  return (
    <>
      {!state.isLoding ? (
        <ScrollView>
          <VStack
            space={12}
            alignItems={'center'}
            style={{flex: 1, paddingTop: 20}}>
            <View style={{justifyContent: 'center', flexDirection: 'row'}}>
              <Carousel
                data={state.banners}
                renderItem={_renderBannerItem}
                sliderWidth={400}
                itemWidth={320}
                loop={true}
                layout={'default'}
                inactiveSlideScale={0.95}
                inactiveSlideOpacity={0.2}
                sliderHeight={200}
                itemHeight={150}
                useScrollView={true}
              />
            </View>
            <Box w={'full'}>
              <Text
                color={Colors.teal}
                fontWeight={'bold'}
                pl={10}
                fontSize={'lg'}>
                Categories
              </Text>
              <Box
                mt={4}
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Carousel
                  data={state.category}
                  renderItem={_renderCategoriesItem}
                  sliderWidth={410}
                  itemWidth={140}
                  loop={true}
                  layout={'default'}
                  inactiveSlideScale={0.8}
                  inactiveSlideOpacity={1}
                  sliderHeight={150}
                />
              </Box>
            </Box>
            <Box w={'full'}>
              <Text
                color={Colors.teal}
                fontWeight={'bold'}
                pl={10}
                fontSize={'lg'}>
                Doctors
              </Text>
              <Box
                mt={4}
                style={{
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <ScrollView horizontal={true}>
                  {state.doctors.map(item => {
                    return (
                      <Box
                        key={item.id}
                        my={5}
                        shadow={1}
                        style={{
                          backgroundColor: Colors.white,
                          borderRadius: 25,
                          height: 140,
                          width: 160,
                          padding: 20,
                          marginHorizontal: 20,
                          justifyContent: 'space-around',
                          alignItems: 'center',
                        }}>
                        <Image
                          style={{width: 50, height: 50, borderRadius: 100}}
                          source={{uri: img_url + item.profile_image}}
                        />
                        <Text>{item.doctor_name}</Text>
                      </Box>
                    );
                  })}
                </ScrollView>
              </Box>
            </Box>

            <Box
              mb={3}
              flexDirection={'row'}
              justifyContent={'space-around'}
              w={'full'}>
              <Button
                onPress={() =>
                  props.navigation.navigate('DoctorsList', {type: 1})
                }
                shadow="2"
                py={4}
                rounded="xl"
                size="lg">
                Book Online
              </Button>
              <Button
                onPress={() =>
                  props.navigation.navigate('DoctorsList', {type: 2})
                }
                shadow="2"
                colorScheme={'secondary'}
                py={4}
                rounded="xl"
                size="lg">
                Book In Place
              </Button>
            </Box>
          </VStack>
        </ScrollView>
      ) : (
        <Loader/>
      )}
    </>
  );
};

export default Home;
