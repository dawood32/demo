import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  SendbirdCalls,
  DirectCallVideoView,
  SoundType,
} from '@sendbird/calls-react-native';
import Permissions, {PERMISSIONS} from 'react-native-permissions';
import {createUser, getUserInfo} from './Components/CreateUser';
const AppId = 'F75BFFEB-753C-400E-8885-8FC9E55A80AC';

SendbirdCalls.initialize(AppId);

const App = () => {
  const [callId, setCallId] = useState(null);

  const handleUserCreate = async () => {
    await requestPermissions();

    const response = await createUser();
    if (
      response.error &&
      response.message == '"user_id" violates unique constraint.'
    ) {
      const res = await getUserInfo();
      await userAuthenticate(res.user_id, res.access_token);
      setCallProperties(res.user_id);
    } else {
      if (response.is_created) {
        await userAuthenticate(response.user_id, response.access_token);
      }
    }
    console.log('UserCreated:', response);
  };

  const requestPermissions = async () => {
    const CALL_PERMISSIONS = Platform.select({
      android: [
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
      ],
      ios: [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MICROPHONE],
      default: [],
    });

    await Permissions.requestMultiple(CALL_PERMISSIONS);
  };

  const userAuthenticate = async (userid, token) => {
    try {
      const user = await SendbirdCalls.authenticate({
        userId: userid,
        accessToken: token,
      });
      console.log('User authenticated:', user);
    } catch (e) {
      console.error('Authentication error:', e);
    }
  };

  const makeCall = async () => {
    const callOptions = {
      audioEnabled: true,
      videoEnabled: true,
      frontCamera: true,
    };

    const call = await SendbirdCalls.dial(
      'sendbird_desk_agent_id_67d1f4d8-5bc9-4356-81b6-45b622198717',
      true,
      callOptions,
    );
    console.log('Call made:', call);
    setCallId(call.callId);

    const directCall = await SendbirdCalls.getDirectCall(call.callId);
    directCall.addListener({
      // ...
    });
  };

  return (
    <View style={{flex: 1}}>
      {callId && (
        <>
          <View style={{height: 350, width: '100%'}}>
            <DirectCallVideoView
              resizeMode="cover"
              viewType="local"
              callId={callId}
              android_zOrderMediaOverlay
              style={StyleSheet.absoluteFill}
            />
          </View>
          <View style={{height: 350, width: '100%'}}>
            <DirectCallVideoView
              resizeMode="cover"
              viewType="remote"
              callId={callId}
              android_zOrderMediaOverlay
              style={StyleSheet.absoluteFill}
            />
          </View>
        </>
      )}
      <TouchableOpacity onPress={handleUserCreate} style={styles.button}>
        <Text style={styles.buttonText}>CreateUser</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={makeCall} style={styles.button}>
        <Text style={styles.buttonText}>Start Call</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default App;
