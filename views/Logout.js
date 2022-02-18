import React from 'react'
import {View, Text} from 'react-native'
import AsyncStorageLib from '@react-native-async-storage/async-storage'

const Logout = props => {
    React.useEffect(() => {
        clear()
        resetMenu()
    }, [])

    const clear = async () => await AsyncStorageLib.clear()

    const resetMenu = () => props.navigation.navigate('Splash')

    return (
        <View>
            <View>
                <Text>Please wait...</Text>
            </View>
        </View>
    )
}

export default Logout
