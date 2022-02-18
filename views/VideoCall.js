import axios from 'axios'
import {Button, Center, Text, View} from 'native-base'
import React, { useRef} from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import {
    TwilioVideoLocalView,
    TwilioVideoParticipantView,
    TwilioVideo,
} from 'react-native-twilio-video-webrtc'
import {api_url} from '../config/Constants'

const DoctorVideoCall = props => {
    const [isAudioEnabled, setIsAudioEnabled] = React.useState(true)
    // const [isVideoEnabled, setIsVideoEnabled] = React.useState(true)
    const [status, setStatus] = React.useState('disconnected')
    // const [participants, setParticipants] = React.useState(new Map())
    const [videoTracks, setVideoTracks] = React.useState(new Map())
    const [token, setToken] = React.useState('')
    const twilioRef = useRef(null)
    console.log(status)

    React.useEffect(() => {
        getAccessTokenFromServer()
    }, [])
    console.log(props.route.params.booking_id)
    console.log(props.route.params.booking_id)
    const getAccessTokenFromServer = async () => {
        await axios({
            method: 'get',
            url:
        api_url +
        'get_access_token_for_video' +
        '/' +
        props.route.params.booking_id,
        })
            .then(async response => {
                console.log(response.data)
                // this.setState({isLoading: false});
                setToken(response.data.result)
            })
            .catch(error => {
                console.log(error)
                // this.setState({isLoading: false});
            })
    }

    const _onConnectButtonPress = () => {
        twilioRef.current.connect({
            accessToken: token,
        })
        setStatus('connecting')
    }

    const _onEndButtonPress = () => {
        twilioRef.current.disconnect()
    }

    const _onMuteButtonPress = () => {
        twilioRef.current
            .setLocalAudioEnabled(!isAudioEnabled)
            .then(isEnabled => setIsAudioEnabled(isEnabled))
    }

    const _onFlipButtonPress = () => {
        twilioRef.current.flipCamera()
    }

    const _onRoomDidConnect = ({roomName, error}) => {
        console.log('onRoomDidConnect: ', roomName)

        setStatus('connected')
    }

    const _onRoomDidDisconnect = ({roomName, error}) => {
        console.log('[Disconnect]ERROR: ', error)

        setStatus('disconnected')
    }

    const _onRoomDidFailToConnect = error => {
        console.log('[FailToConnect]ERROR: ', error)

        setStatus('disconnected')
    }

    const _onParticipantAddedVideoTrack = ({participant, track}) => {
        console.log('onParticipantAddedVideoTrack: ', participant, track)

        setVideoTracks(
            new Map([
                ...videoTracks,
                [
                    track.trackSid,
                    {participantSid: participant.sid, videoTrackSid: track.trackSid},
                ],
            ]),
        )
    }

    const _onParticipantRemovedVideoTrack = ({participant, track}) => {
        console.log('onParticipantRemovedVideoTrack: ', participant, track)

        const videoTracksLocal = videoTracks
        videoTracksLocal.delete(track.trackSid)

        setVideoTracks(videoTracksLocal)
    }

    return (
        <View style={styles.container}>
            {status === 'disconnected' && (
                <Center flex={1}>
                    <View>
                        <Button  onPress={_onConnectButtonPress}>
              Connect
                        </Button>
                    </View>
                </Center>
            )}

            {(status === 'connected' || status === 'connecting') && (
                <View>
                    {status === 'connected' && (
                        <View style={styles.remoteGrid}>
                            {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                                return (
                                    <TwilioVideoParticipantView
                                        style={styles.remoteVideo}
                                        key={trackSid}
                                        trackIdentifier={trackIdentifier}
                                    />
                                )
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
                        <TwilioVideoLocalView
                            style={styles.localVideoOnButtonDisabled}
                            enabled={true}
                        />
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
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    callContainer: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        minHeight: '100%',
    },
    welcome: {
        fontSize: 30,
        textAlign: 'center',
        paddingTop: 40,
    },
    input: {
        height: 50,
        borderWidth: 1,
        marginRight: 70,
        marginLeft: 70,
        marginTop: 50,
        textAlign: 'center',
        backgroundColor: 'white',
    },
    button: {
        marginTop: 100,
        width: '50%',
    },
    localVideoOnButtonEnabled: {
        bottom: '40%',
        width: '35%',
        left: '64%',
        height: '25%',
        zIndex: 2,
    },
    localVideoOnButtonDisabled: {
        bottom: '30%',
        width: '35%',
        left: '64%',
        height: '25%',
        zIndex: 2,
    },
    remoteGrid: {
        flex: 1,
        flexDirection: 'column',
    },
    remoteVideo: {
        width: '100%',
        height: 800,
        // zIndex: 1,
        position: 'absolute',
    },
    optionsContainer: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        zIndex: 2,
    },
    optionButton: {
        width: 60,
        height: 60,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 100 / 2,
        backgroundColor: 'grey',
        justifyContent: 'center',
        alignItems: 'center',
    },
    spacing: {
        padding: 10,
    },
    inputLabel: {
        fontSize: 18,
    },
    buttonContainer: {
    // height: normalize(45),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: '90%',
        borderRadius: 30,
    },
    loginButton: {
        backgroundColor: '#1E3378',
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20,
        marginTop: 10,
    },
    Buttontext: {
        color: 'white',
        fontWeight: '500',
        fontSize: 18,
    },
    inputBox: {
        borderBottomColor: '#cccccc',
        fontSize: 16,
        width: '95%',
        borderBottomWidth: 1,
    },
})
export default DoctorVideoCall
