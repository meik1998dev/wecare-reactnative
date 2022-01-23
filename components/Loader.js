import React from 'react';
import {
  Spinner,
  HStack,
  Heading,
  Center,
  NativeBaseProvider,
} from 'native-base';

import {Colors} from '../assets/Colors.js';

const Loader = () => {
  return (
    <HStack space={2} alignItems="center">
      <Spinner accessibilityLabel="Loading posts" />
      <Heading color={Colors.teal} fontSize="md">
        Loading
      </Heading>
    </HStack>
  );
};

export default Loader;
