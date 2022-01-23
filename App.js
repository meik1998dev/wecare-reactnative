import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {extendTheme, NativeBaseProvider} from 'native-base';
import React from 'react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import allReducers from './reducers/index.js';
import {Colors} from './assets/Colors';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {LogBox} from 'react-native';
import {
  HomeStackNavigator,
  MainStackNavigator,
} from './navigation/StackNavigator.js';
import MyOrders from './views/MyOrders.js';
import MyProfile from './views/MyProfile.js';
import Home from './views/Home.js';
import Login from './views/Login.js';
import Register from './views/Register.js';
import AsyncStorageLib from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import Logout from './views/Logout.js';
import Splash from './views/Splash.js';
import MyBooking from './views/doctorViews/MyBooking.js';
import MyBookingDetails from './views/MyBookingDetails.js';
import MyBookingsDetails from './views/doctorViews/MyBookingsDetails.js';
import DoctorChat from './views/doctorViews/DoctorChat.js';
import { fb } from './config/firebaseConfig.js';

const Drawer = createDrawerNavigator();

const store = createStore(allReducers);

const theme = extendTheme({
  colors: {
    // Add new color
    primary: {
      50: Colors.vintage,
      100: Colors.vintage,
      200: Colors.vintage,
      300: Colors.vintage,
      400: Colors.vintage,
      500: Colors.vintage,
      600: Colors.vintage,
      700: Colors.purpel,
      800: Colors.purpel,
      900: Colors.purpel,
    },
    secondary: {
      50: Colors.yellow,
      100: Colors.yellow,
      200: Colors.yellow,
      300: Colors.yellow,
      400: Colors.yellow,
      500: Colors.yellow,
      600: Colors.yellow,
      700: '#FC9918',
      800: '#FC9918',
      900: '#FC9918',
    },
    // Redefinig only one shade, rest of the color will remain same.
    amber: {
      400: '#d97706',
    },
  },
});
console.log(fb)

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fcfbff',
  },
};

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);

export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider theme={theme}>
        <NavigationContainer theme={MyTheme}>
          <Drawer.Navigator
            screenOptions={{
              headerTitle: 'We Care',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: Colors.white,
              },
            }}>
            <Drawer.Screen name="Home" component={MainStackNavigator} />
            <Drawer.Screen name="Profile" component={MyProfile} />
            <Drawer.Screen name="Doctor Chat" component={DoctorChat} />
            <Drawer.Screen name="My Appointment" component={MyOrders} />
            <Drawer.Screen
              name="Booking Details"
              component={MyBookingsDetails}
            />
            <Drawer.Screen name="My Booking" component={MyBooking} />
            <Drawer.Screen
              options={{
                drawerLabel: () => null,
                title: null,
                drawerIcon: () => null,
              }}
              name="Splash"
              component={Splash}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
}
