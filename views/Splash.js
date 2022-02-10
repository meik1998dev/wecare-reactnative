import {Button, Center, Text} from 'native-base';
import React from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

const Splash = props => {
  React.useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
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
  console.log(global.first_name);
  console.log(global.fcm_token);

  return (
    <Center flex={1} px="3">
      <Text fontSize={20} fontWeight="bold" mb={5}>Welcome , Who are you?</Text>
      <Button
        mb={5}
        rounded="lg"
        w="70%"
        onPress={() => props.navigation.navigate('Doctor Login')}>
        Doctor
      </Button>
      <Button
        mb={5}
        rounded="lg"
        w="70%"
        onPress={() => props.navigation.navigate('Login')}>
        Patiant
      </Button>
    </Center>
  );
};

export default Splash;
