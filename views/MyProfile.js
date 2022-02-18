import axios from 'axios'
import {
    Box,
    Button,
    Input,
    ScrollView,
    Select,
    Text,
    VStack,
} from 'native-base'
import React from 'react'
import {Keyboard, Image} from 'react-native'
import {
    api_url,
    get_blood_list,
    get_profile,
    img_url,
    profile_update,
} from '../config/Constants'
import {Colors} from '../assets/Colors'
import Loader from '../components/Loader'

const MyProfile = props => {
    const [state, setState] = React.useState({
        profile_picture: '',
        first_name: '',
        mid_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        gender: '',
        gov_id: '',
        validation: true,
        blood_group: '',
    })
    const [loading, setLoading] = React.useState(true)
    const [bloodList, setBloodList] = React.useState([])

    React.useEffect(() => {
        getProfile()
    }, [])

    const getProfile = async () => {
        setLoading(true)
        await axios({
            method: 'post',
            url: api_url + get_profile,
            data: {customer_id: global.id},
        })
            .then(response => {
                console.log(response.data)
                setState({
                    ...state,
                    first_name: response.data.result.first_name,
                    mid_name: response.data.result.mid_name,
                    last_name: response.data.result.last_name,
                    gov_id: response.data.result.gov_id,
                    email: response.data.result.email,
                    phone_number: response.data.result.phone_number,
                    profile_picture: response.data.result.profile_picture,
                    blood_group: response.data.result.blood_group,
                })
                getBloodList()

                setLoading(false)
            })
            .catch(error => {
                console.log(error)
                // setLoading(false);
            })
    }

    const getBloodList = async () => {
        await axios({
            method: 'get',
            url: api_url + get_blood_list,
        })
            .then(async response => {
                setBloodList(response.data.result)
            })
            .catch(error => {
                console.log(error)
                alert('Sorry, something went wrong!')
            })
    }

    const select_blood_group = value => {
        setState({...state, blood_group: value})
    }

    const checkValidate = () => {
        if (
            state.email == '' ||
      state.phone_number == '' ||
      state.blood_group == '' ||
      state.first_name == ''
        ) {
            state.validation = false
            alert('Please fill all the fields.')
            return true
        }
    }

    const updateProfile = async () => {
        Keyboard.dismiss()
        await checkValidate()
        if (state.validation) {
            await axios({
                method: 'post',
                url: api_url + profile_update,
                data: {
                    id: global.id,
                    first_name: state.first_name,
                    mid_name: state.mid_name,
                    last_name: state.last_name,
                    gov_id: state.gov_id,
                    email: state.email,
                    phone_number: state.phone_number,
                    // profile_picture: props.profile_picture,
                    blood_group: state.blood_group,
                },
            })
                .then(async response => {
                    console.log(response.data)
                    alert('Successfully updated')
                    await saveData()
                })
                .catch(error => {
                    alert(error)
                })
        }
    }
    console.log(state)
    const saveData = async () => {
        try {
            await AsyncStorage.setItem('user_id', props.data.id.toString())
            await AsyncStorage.setItem(
                'first_name',
                props.data.first_name.toString(),
            )
            global.id = await props.data.id
            global.first_name = await props.data.first_name
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <Box flex={1} width={'full'}>
                        <Text
                            py={5}
                            px={3}
                            color={Colors.teal}
                            fontWeight={'bold'}
                            fontSize={20}>
              My Profile
                        </Text>
                        <ScrollView
                            contentContainerStyle={{alignItems: 'center'}}
                            w={'100%'}>
                            <Image
                                alt="avatar"
                                style={{
                                    marginBottom: 10,
                                    width: 150,
                                    borderRadius: 100,
                                    height: 150,
                                }}
                                source={{
                                    uri: img_url + state.profile_image,
                                }}
                            />
                            <VStack px={6} space={4}>
                                <Text pl={2} mb={-3} color={Colors.purpel}>
                  First Name
                                </Text>
                                <Input
                                    rounded={'lg'}
                                    value={state.first_name}
                                    fontSize={15}
                                    onChangeText={TextInputValue =>
                                        setState({...state, first_name: TextInputValue})
                                    }
                                />
                                <Text pl={2} mb={-3} color={Colors.purpel}>
                  Midel Name
                                </Text>
                                <Input
                                    rounded={'lg'}
                                    value={state.mid_name}
                                    fontSize={15}
                                    onChangeText={TextInputValue =>
                                        setState({...state, mid_name: TextInputValue})
                                    }
                                />
                                <Text pl={2} mb={-3} color={Colors.purpel}>
                  Last Name
                                </Text>
                                <Input
                                    rounded={'lg'}
                                    value={state.last_name}
                                    fontSize={15}
                                    onChangeText={TextInputValue =>
                                        setState({...state, last_name: TextInputValue})
                                    }
                                />
                                <Text pl={2} mb={-3} color={Colors.purpel}>
                  Phone Number
                                </Text>
                                <Input
                                    rounded={'lg'}
                                    value={state.phone_number}
                                    fontSize={15}
                                    keyboardType="phone-pad"
                                    onChangeText={TextInputValue =>
                                        setState({...state, phone_number: TextInputValue})
                                    }
                                />
                                <Text pl={2} mb={-3} color={Colors.purpel}>
                  Email Address
                                </Text>
                                <Input
                                    rounded={'lg'}
                                    value={state.email}
                                    fontSize={15}
                                    keyboardType="email-address"
                                    onChangeText={TextInputValue =>
                                        setState({...state, email: TextInputValue})
                                    }
                                />
                                <Text pl={2} mb={-3} color={Colors.purpel}>
                  Gov ID
                                </Text>
                                <Input
                                    rounded={'lg'}
                                    value={state.gov_id}
                                    fontSize={15}
                                    maxLength={10}
                                    onChangeText={TextInputValue =>
                                        setState({...state, gov_id: TextInputValue})
                                    }
                                />
                                <Text pl={2} mb={-3} color={Colors.purpel}>
                  Blood Group{' '}
                                </Text>

                                {bloodList && (
                                    <Select
                                        rounded={'lg'}
                                        fontSize={15}
                                        minWidth="200"
                                        selectedValue={state.blood_group}
                                        onValueChange={itemValue =>
                                            setState({...state, blood_group: itemValue})
                                        }>
                                        {bloodList.map(item => (
                                            <Select.Item
                                                key={item.id}
                                                label={item.blood_group}
                                                value={item.blood_group}
                                            />
                                        ))}
                                    </Select>
                                )}
                                <Text pl={2} mb={-3} color={Colors.purpel}>
                  Gender{' '}
                                </Text>

                                {/* <Select
              rounded={'lg'}
              fontSize={15}
              onValueChange={itemValue =>
                setState({...state, gender: itemValue})
              }
              minWidth="200"
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size="5" />,
              }}
              selectedValue={state.gender}>
              <Select.Item key={'Male'} label="Male" value="male" />
              <Select.Item key={'Female'} label="Female" value="female" />
            </Select> */}
                                <Text pl={2} mb={-3} color={Colors.purpel}>
                  Password
                                </Text>
                                <Input
                                    rounded={'lg'}
                                    value={state.first_name}
                                    fontSize={15}
                                    secureTextEntry={true}
                                    onChangeText={TextInputValue =>
                                        setState({...state, password: TextInputValue})
                                    }
                                />
                                <Button onPress={updateProfile} mb={10} py={3} rounded={'lg'}>
                  Update
                                </Button>
                            </VStack>
                        </ScrollView>
                    </Box>
                </>
            )}
        </>
    )
}

export default MyProfile
