import React, {Component} from 'react';
import {AppRegistry, StyleSheet, View, TouchableOpacity} from 'react-native';
import {Icon, Row, Col} from 'native-base';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';
import {request, PERMISSIONS} from 'react-native-permissions';
// import * as colors from '../assets/css/Colors';
import {api_url, get_access_token_for_video} from '../config/Constants';
// import { Loader } from '../components/GeneralComponents';
import axios from 'axios';
export default class VideoCall extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      isAudioEnabled: true,
      isVideoEnabled: true,
      status: 'disconnected',
      booking_id: this.props.route.params.data.booking_id,
      participants: new Map(),
      videoTracks: new Map(),
      roomName: '',
      token: '',
    };
    this.permission_check();
  }

  getAccessTokenFromServer = async () => {
    this.setState({isLoading: true});
    await axios({
      method: 'get',
      url: api_url + get_access_token_for_video + '/' + this.state.booking_id,
    })
      .then(async response => {
        console.log(response.data);
        this.setState({isLoading: false});
        this.refs.twilioVideo.connect({
          roomName: this.state.booking_id.toString(),
          accessToken: response.data.result,
          status: 'connecting',
        });
      })
      .catch(error => {
        console.log(error);
        this.setState({isLoading: false});
      });
  };

  handleBackButtonClick = () => {
    this.props.navigation.goBack(null);
  };

  async permission_check() {
    /*check(PERMISSIONS.ANDROID.RECORD_AUDIO)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          alert(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          alert(
            'The permission has not been requested / is denied but requestable',
          );
          break;
        case RESULTS.GRANTED:
          alert('The permission is granted');
          break;
        case RESULTS.BLOCKED:
          alert('The permission is denied and not requestable anymore');
          break;
      }
    })
    .catch((error) => {
      // …
    });*/
    await request(PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
      this.setState({audio_permission: result});
    });

    await request(PERMISSIONS.ANDROID.CAMERA).then(result => {
      this.setState({video_permission: result});
    });

    if (
      this.state.audio_permission == 'granted' &&
      this.state.video_permission == 'granted'
    ) {
      await this.getAccessTokenFromServer();
    } else {
      alert('Sorry permission not granted');
    }
  }

  _onEndButtonPress = () => {
    this.refs.twilioVideo.disconnect();
  };

  _onMuteButtonPress = () => {
    this.refs.twilioVideo
      .setLocalAudioEnabled(!this.state.isAudioEnabled)
      .then(isEnabled => this.setState({isAudioEnabled: isEnabled}));
  };

  _onFlipButtonPress = () => {
    this.refs.twilioVideo.flipCamera();
  };

  _onRoomDidConnect = () => {
    this.setState({status: 'connected'});
  };

  _onRoomDidDisconnect = ({roomName, error}) => {
    this.setState({status: 'disconnected'});
    this.handleBackButtonClick();
  };

  _onRoomDidFailToConnect = error => {
    alert('ERROR: 2');

    this.setState({status: 'disconnected'});
  };

  _onParticipantAddedVideoTrack = ({participant, track}) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track);

    this.setState({
      videoTracks: new Map([
        ...this.state.videoTracks,
        [
          track.trackSid,
          {participantSid: participant.sid, videoTrackSid: track.trackSid},
        ],
      ]),
    });
  };

  _onParticipantRemovedVideoTrack = ({participant, track}) => {
    console.log('onParticipantRemovedVideoTrack: ', participant, track);

    const videoTracks = this.state.videoTracks;
    videoTracks.delete(track.trackSid);

    this.setState({videoTracks: new Map([...videoTracks])});
  };

  render() {
    console.log(this.state.booking_id);

    return (
      <View style={styles.vid_style1}>
        {/* <Loader visible={this.state.isLoading} /> */}
        
        {(this.state.status === 'connected' ||
          this.state.status === 'connecting') && (
          <View style={styles.vid_style2}>
            {this.state.status === 'connected' && (
              <View style={styles.vid_style3}>
                {Array.from(
                  this.state.videoTracks,
                  ([trackSid, trackIdentifier]) => {
                    return (
                      <TwilioVideoParticipantView
                        style={styles.vid_style4}
                        key={trackSid}
                        trackIdentifier={trackIdentifier}
                      />
                    );
                  },
                )}
              </View>
            )}
            <Row style={styles.vid_style5}>
              <Col style={styles.vid_style6}>
                <TouchableOpacity
                  style={styles.vid_style7}
                  activeOpacity={1}
                  onPress={this._onMuteButtonPress}>
                  {this.state.isAudioEnabled ? (
                    <Icon style={styles.vid_style8} name="mic" />
                  ) : (
                    <Icon style={styles.vid_style9} name="mic-off" />
                  )}
                </TouchableOpacity>
              </Col>
              <Col style={styles.vid_style10}>
                <TouchableOpacity
                  style={styles.vid_style11}
                  activeOpacity={1}
                  onPress={this._onEndButtonPress}>
                  <Icon style={styles.vid_style12} name="call" />
                </TouchableOpacity>
              </Col>
              <Col style={styles.vid_style13}>
                <TouchableOpacity
                  style={styles.vid_style14}
                  activeOpacity={1}
                  onPress={this._onFlipButtonPress}>
                  <Icon style={styles.vid_style15} name="refresh" />
                </TouchableOpacity>
              </Col>
              <TwilioVideoLocalView enabled={true} style={styles.vid_style16} />
            </Row>
          </View>
        )}

        <TwilioVideo
          ref="twilioVideo"
          onRoomDidConnect={this._onRoomDidConnect}
          onRoomDidDisconnect={this._onRoomDidDisconnect}
          onRoomDidFailToConnect={this._onRoomDidFailToConnect}
          onParticipantAddedVideoTrack={this._onParticipantAddedVideoTrack}
          onParticipantRemovedVideoTrack={this._onParticipantRemovedVideoTrack}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  vid_style1: {flex: 1, backgroundColor: 'white'},
  vid_style2: {
    flex: 1,
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  vid_style3: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vid_style4: {
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    width: '100%',
    height: '100%',
  },
  vid_style5: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 100,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  vid_style6: {alignItems: 'center', justifyContent: 'center'},
  vid_style7: {
    width: 50,
    height: 50,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vid_style8: {color: 'black'},
  vid_style9: {color: 'black'},
  vid_style10: {alignItems: 'center', justifyContent: 'center'},
  vid_style11: {
    width: 70,
    height: 70,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vid_style12: {color: 'black'},
  vid_style13: {alignItems: 'center', justifyContent: 'center'},
  vid_style14: {
    width: 50,
    height: 50,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 100 / 2,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vid_style15: {color: 'black'},
  vid_style16: {
    flex: 1,
    width: 130,
    height: 200,
    position: 'absolute',
    right: 10,
    bottom: 100,
  },
});

AppRegistry.registerComponent('VideoCall', () => VideoCall);
