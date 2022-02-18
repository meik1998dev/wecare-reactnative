import React from 'react'
import { StyleSheet, View } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { api_url, chat_icon, chat_pusher } from '../config/Constants'
import axios from 'axios'
import database from '@react-native-firebase/database'
import { Colors } from '../assets/Colors'
import AsyncStorageLib from '@react-native-async-storage/async-storage'

export default Chat = (props) => {
  const [state, setState] = React.useState({
    messages: [],
    data: props.route.params.data,
    source: undefined,
    isLoding: false,
    user_id: '',
    first_name: '',
  })

  React.useEffect(() => {
    const getStoredUserInfo = async () => {
      const user_id = await AsyncStorageLib.getItem('user_id')
      const first_name = await AsyncStorageLib.getItem('first_name')

      setState({ ...state, user_id: user_id, first_name: first_name })
    }

    getStoredUserInfo()
    refOn((message) => {
      console.log('oldmessage will store in state', message)
      setState((prevState) => {
        return {
          ...state,
          messages: GiftedChat.append(prevState.messages, message),
        }
      })
    })
  }, [])

  const refOn = (callback) => {
    database()
      .ref('/chat/' + state.data.booking_id)
      .limitToLast(20)
      .on('child_added', (snapshot) => {
        console.log('Oldmessages :', snapshot)
        callback(parse(snapshot))
      })
  }

  const parse = (snapshot) => {
    const { text, user, image } = snapshot.val()
    const { key: _id } = snapshot
    const message = { _id, text, user, image }
    return message
  }

  const onSend = (messages) => {
    console.log(messages)
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i]
      const message = { text, user }
      console.log(database().ref('/chat/' + state.data.booking_id))
      database()
        .ref('/chat/' + state.data.booking_id)
        .push(message)
      chatPusher(message.text)
    }
  }

  const chatPusher = async (message) => {
    await axios({
      method: 'post',
      url: api_url + chat_pusher,
      data: { type: 1, booking_id: state.data.booking_id, message: message },
    })
      .then(async (response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log('not sent')
        console.log(error)
      })
  }

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        wrapperStyle={{
          left: {
            backgroundColor: Colors.yellow,
          },

          right: {
            backgroundColor: Colors.vintage,
          },
        }}
        textInputStyle={{ color: 'black' }}
        messages={state.messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: global.id + '-Cr',
          name: global.first_name,
          avatar: chat_icon,
        }}
        showUserAvatar
      />
    </View>
  )
}