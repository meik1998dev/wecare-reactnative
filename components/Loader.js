import React from 'react'
import {
    Spinner,
    HStack,
    Heading,
    Center,
    NativeBaseProvider,
} from 'native-base'

import {Colors} from '../assets/Colors.js'

const Loader = () => {
    return (
        <Center flex={1}>
            <HStack space={2} alignItems="center">
                <Spinner size={'lg'} accessibilityLabel="Loading posts" />
                <Heading size={'lg'} color={Colors.teal} fontSize="md">
          Loading
                </Heading>
            </HStack>
        </Center>
    )
}

export default Loader
