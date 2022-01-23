import {Button, Text, View} from 'native-base';
import React, {Component, useRef} from 'react';
import {StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo,
} from 'react-native-twilio-video-webrtc';

const DoctorVideoCall = props => {
  const [isAudioEnabled, setIsAudioEnabled] = React.useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = React.useState(true);
  const [status, setStatus] = React.useState('disconnected');
  const [participants, setParticipants] = React.useState(new Map());
  const [videoTracks, setVideoTracks] = React.useState(new Map());
  const [token, setToken] = React.useState('');
  const twilioRef = useRef(null);
  console.log(status);
  const _onConnectButtonPress = () => {
    twilioRef.current.connect({
      accessToken:
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzIwODMyZmZmZTg1ZDVhYjFlMzkzOGIwN2FiZWRkNmYwLTE2NDI4OTA1NzUiLCJpc3MiOiJTSzIwODMyZmZmZTg1ZDVhYjFlMzkzOGIwN2FiZWRkNmYwIiwic3ViIjoiQUNlMzhhNjA3NGQxZmYxNGI1ODUxMmUyMTdhNWVjMTgwNiIsImV4cCI6MTY0Mjg5NDE3NSwiZ3JhbnRzIjp7ImlkZW50aXR5IjoicGFydG5lcl8xNjQyODkwNTc1IiwidmlkZW8iOnsicm9vbSI6IjcifX19.vNteq2MwIy34Dbs2E2VnQ1coI6ymU3gftLGNGyFfvj8',
    });
    setStatus('connecting');
  };

  const _onEndButtonPress = () => {
    twilioRef.current.disconnect();
  };

  const _onMuteButtonPress = () => {
    twilioRef.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then(isEnabled => setIsAudioEnabled(isEnabled));
  };

  const _onFlipButtonPress = () => {
    twilioRef.current.flipCamera();
  };

  const _onRoomDidConnect = ({roomName, error}) => {
    console.log('onRoomDidConnect: ', roomName);

    setStatus('connected');
  };

  const _onRoomDidDisconnect = ({roomName, error}) => {
    console.log('[Disconnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const _onRoomDidFailToConnect = error => {
    console.log('[FailToConnect]ERROR: ', error);

    setStatus('disconnected');
  };

  const _onParticipantAddedVideoTrack = ({participant, track}) => {
    console.log('onParticipantAddedVideoTrack: ', participant, track);

    setVideoTracks(
      new Map([
        ...videoTracks,
        [
          track.trackSid,
          {participantSid: participant.sid, videoTrackSid: track.trackSid},
        ],
      ]),
    );
  };

  const _onParticipantRemovedVideoTrack = ({participant, track}) => {
    console.log('onParticipantRemovedVideoTrack: ', participant, track);

    const videoTracksLocal = videoTracks;
    videoTracksLocal.delete(track.trackSid);

    setVideoTracks(videoTracksLocal);
  };

  return (
    <View style={styles.container}>
      {status === 'disconnected' && (
        <View>
          <Text style={styles.welcome}>React Native Twilio Video</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={token}
            onChangeText={text => setToken(text)}></TextInput>
          <Button
            title="Connect"
            style={styles.button}
            onPress={_onConnectButtonPress}></Button>
        </View>
      )}

      {(status === 'connected' || status === 'connecting') && (
        <View   >
          {status === 'connected' && (
            <View style={styles.remoteGrid}>
              {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                return (
                  <TwilioVideoParticipantView
                    style={styles.remoteVideo}
                    key={trackSid}
                    trackIdentifier={trackIdentifier}
                  />
                );
              })}
            </View>
          )}
          <View style={{width: 500, height: 500}}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onEndButtonPress}>
              <Text style={{fontSize: 12}}>End</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onMuteButtonPress}>
              <Text style={{fontSize: 12}}>
                {isAudioEnabled ? 'Mute' : 'Unmute'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onFlipButtonPress}>
              <Text style={{fontSize: 12}}>Flip</Text>
            </TouchableOpacity>
            <TwilioVideoLocalView enabled={true} style={styles.localVideo} />
          </View>
        </View>
      )}

      <TwilioVideo
        ref={twilioRef}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
      />
    </View>
  );
};
const styles = StyleSheet.create({});
export default DoctorVideoCall;
