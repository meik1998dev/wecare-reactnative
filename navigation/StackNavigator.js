import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Chat from '../views/Chat';
import createAppointment from '../views/createAppointment';
import DoctorsList from '../views/DoctorsList';
import DoctorHome from '../views/doctorViews/DoctorHome';
import DoctorLogin from '../views/doctorViews/DoctorLogin';
import DoctorRegister from '../views/doctorViews/DoctorRegister';
import Forgot from '../views/Forgot';
import Home from '../views/Home';
import Login from '../views/Login';
import MyBookingDetails from '../views/MyBookingDetails';
import MyOrders from '../views/MyOrders';
import Register from '../views/Register';
import Splash from '../views/Splash';
import VideoCall from '../views/VideoCall';
import DoctorVideoCall from '../views/doctorViews/DoctorVideo';
const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         <Stack.Screen name='Splash' component={Splash} />
         <Stack.Screen name='DoctorVideo' component={DoctorVideoCall} />
         <Stack.Screen name='Doctor Home' component={DoctorHome} />
         <Stack.Screen name='Doctor Login' component={DoctorLogin}/>
         <Stack.Screen name='Doctor Register' component={DoctorRegister}/>
         <Stack.Screen name='Login' component={Login} />
         <Stack.Screen name='HomeStack' component={Home} />
         <Stack.Screen name='Register' component={Register} />
         
         <Stack.Screen name='Video' component={VideoCall} />
         <Stack.Screen name='DoctorsList' component={DoctorsList} />
         <Stack.Screen name='My Orders' component={MyOrders} />
         <Stack.Screen
            name='Create Appointment'
            component={createAppointment}
         />
         <Stack.Screen name='Chat' component={Chat} />
         <Stack.Screen name='My Booking Details' component={MyBookingDetails} />
         <Stack.Screen name='Forgot' component={Forgot} />
      </Stack.Navigator>
   );
};

const HomeStackNavigator = () => {
   return (
      <Stack.Navigator>
         <Stack.Screen name='Home' component={Home} />
      </Stack.Navigator>
   );
};

export { HomeStackNavigator, MainStackNavigator };
