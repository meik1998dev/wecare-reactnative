import React from 'react';
import {StyleSheet, View} from 'react-native';
import {GiftedChat, Actions} from 'react-native-gifted-chat';
import {
  img_url,
  image_upload,
  api_url,
  chat_icon,
  chat_pusher,
} from '../config/Constants';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import ImagePicker from 'react-native-image-picker';
// import RNFetchBlob from 'react-native-fetch-blob';
import axios from 'axios';
import database from '@react-native-firebase/database';
import {Colors} from '../assets/Colors';

const options = {
  title: 'Select a photo',
  takePhotoButtonTitle: 'Take a photo',
  chooseFromLibraryButtonTitle: 'Choose from gallery',
  quality: 1,
  maxWidth: 500,
  maxHeight: 500,
};

export default Chat = props => {
  const [state, setState] = React.useState({
    messages: [],
    data: props.route.params.data,
    source: undefined,
    isLoding: false,
  });

  console.log(state);

  React.useEffect(() => {
    refOn(message => {
      console.log('oldmessage will store in state', message);
      setState(prevState => {
        return {
          ...state,
          messages: GiftedChat.append(prevState.messages, message),
        };
      });
      // setState({
      //   ...state,
      //   messages: GiftedChat.append(state.messages, message),
      // });
    });
    // setState(previousState => ({
    //   messages: GiftedChat.append(previousState.messages, message),
    //   })
    // )
  }, []);

  const refOn = callback => {
    database()
      .ref('/chat/' + state.data.booking_id)
      .limitToLast(20)
      .on('child_added', snapshot => {
        console.log('Oldmessages :', snapshot);
        callback(parse(snapshot));
      });
  };

  const parse = snapshot => {
    const {text, user, image} = snapshot.val();
    const {key: _id} = snapshot;
    const message = {_id, text, user, image};
    return message;
  };

  const onSend = messages => {
    console.log(messages);
    for (let i = 0; i < messages.length; i++) {
      const {text, user} = messages[i];
      const message = {text, user};
      console.log(database().ref('/chat/' + state.data.booking_id));
      database()
        .ref('/chat/' + state.data.booking_id)
        .push(message);
      chatPusher(message.text);
    }
  };

  const chatPusher = async message => {
    await axios({
      method: 'post',
      url: api_url + chat_pusher,
      data: {type: 1, booking_id: state.data.booking_id, message: message},
    })
      .then(async response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log('not sent');
        console.log(error);
      });
  };

  const select_photo = () => {
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.uri};
        setState({...state, source: response.data});
        profileimageupdate();
      }
    });
  };

  profileimageupdate = async () => {
    setState({...state, isLoding: true});
    RNFetchBlob.fetch(
      'POST',
      api_url + image_upload,
      {
        'Content-Type': 'multipart/form-data',
      },
      [
        {
          name: 'image',
          filename: 'image.png',
          type: 'image/png',
          data: state.source,
        },
        {
          name: 'booking_id',
          data: state.data.booking_id.toString(),
        },
      ],
    )
      .then(resp => {
        setState({...state, isLoding: false});
        let data = resp.data;
        data = JSON.parse(data);
        let message = {
          user: {
            _id: global.id + '-Cr',
            name: global.customer_name,
            avatar: chat_icon,
          },
          image: img_url + data.result,
        };
        database()
          .ref('/chat/' + state.data.booking_id)
          .push(message);
      })
      .catch(err => {
        console.log(err);
        setState({...state, isLoding: false});
        //alert("Error on while uploading,Try again");
      });
  };

  renderActions = props => {
    return (
      <Actions
        {...props}
        containerStyle={styles.chat_style1}
        // icon={() => (
        //   <FontAwesome  name='paperclip'
        //     size={25}
        //     color='black'
        //     style={styles.chat_style2}
        //   />
        // )}
        options={{
          'Choose From Library': () => {
            select_photo();
          },
          Cancel: () => {
            console.log('Cancel');
          },
        }}
        optionTintColor="#222B45"
      />
    );
  };

  console.log(global.first_name);
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
          _id: global.id + '-Cr',
          name: global.first_name,
          avatar: chat_icon,
        }}
        showUserAvatar
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chat_style1: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 0,
  },
  chat_style2: {color: Colors.teal},
});
