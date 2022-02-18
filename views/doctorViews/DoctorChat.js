import React from 'react'
import {StyleSheet, View} from 'react-native'
import {GiftedChat} from 'react-native-gifted-chat'
import {
  api_url,
  chat_icon,
  chat_pusher,
} from '../../config/Constants'
import axios from 'axios'
import database from '@react-native-firebase/database'
import {Colors} from '../../assets/Colors'


export default DoctorChat = props => {
  const [state, setState] = React.useState({
    messages: [],
    data: props.route.params.data,
    source: undefined,
    isLoding: false,
  })

  //   console.log(state);

  React.useEffect(() => {
    const newReference = database()
    console.log('xxxxxxxxxxx', newReference)
    refOn(message => {
      console.log('oldmessage will store in state', message)
      setState(prevState => {
        console.log(prevState)
        return {
          ...state,
          messages: GiftedChat.append(prevState.messages, message),
        }
      })
   
    })
 
  }, [])

  const refOn = callback => {
    database()
      .ref('/chat/' + state.data.id)
      .limitToLast(20)
      .on('child_added', snapshot => {
        console.log('Oldmessages :', snapshot)
        callback(parse(snapshot))
      })
  }

  const parse = snapshot => {
    const {text, user, image} = snapshot.val()
    const {key: _id} = snapshot
    const message = {_id, text, user, image}
    return message
  }

  const onSend = messages => {
    for (let i = 0; i < messages.length; i++) {
      const {text, user} = messages[i]
      const message = {text, user}
      console.log(database().ref('/chat/' + state.data.id))
      database()
        .ref('/chat/' + state.data.id)
        .push(message)
      chatPusher(message.text)
    }
  }

  const chatPusher = async message => {
    await axios({
      method: 'post',
      url: api_url + chat_pusher,
      data: {type: 2, booking_id: state.data.id, message: message},
    })
      .then(async response => {
        console.log(response.data)
      })
      .catch(error => {
        console.log('not sent')
        console.log(error)
      })
  }

  console.log(global.first_name)
  return (
    <View style={{flex: 1}}>
      <GiftedChat
        wrapperStyle={{
          left: {
            backgroundColor: Colors.yellow,
          },

          right: {
            backgroundColor: Colors.vintage,
          },
        }}
        textInputStyle={{color: 'black'}}
        messages={state.messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: global.id + '-Dr',
          name: global.doctor_name,
          avatar: chat_icon,
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  chat_style1: {
    backgroundColor: '#0000',
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 0,
  },
  chat_style2: {color: Colors.teal},
})
