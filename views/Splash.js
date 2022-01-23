import {Button, Text, View} from 'native-base';
import React from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

const Splash = props => {
  React.useEffect(() => {
    getToken();
    // clear();
  }, []);

  const getToken = async () => {
    let fcmToken = await AsyncStorageLib.getItem('fcmToken');
    console.log(fcmToken);
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

  const clear = async () => {
    await AsyncStorageLib.clear();
  };

  return (
    <View>
      <Button onPress={() => props.navigation.navigate('Doctor Login')}>
        Doctor
      </Button>
      <Button onPress={() => props.navigation.navigate('Login')}>
        Patiant
      </Button>
    </View>
  );
};

export default Splash;
