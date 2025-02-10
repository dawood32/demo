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
if (Platform.OS === 'android') {
  SendbirdCalls.addDirectCallSound(SoundType.RINGING, 'ringing.mp3');
}

SendbirdCalls.initialize(AppId);

const App = () => {
  const [callId, setCallId] = useState(null);

  useEffect(() => {
    useHandle();
  }, []);

  const useHandle = async () => {
    await userAuthenticate();
    await getCurrentUser();
    await receiceCall();
  };
  const receiceCall = () => {
    SendbirdCalls.setListener({
      async onRinging(callProps) {
        const directCall = await SendbirdCalls.getDirectCall(callProps.callId);
        console.log(directCall, 'directcall');
        setCallId(callProps.callId);
        directCall.accept();
        const unsubscribe = directCall.addListener({
          onEnded() {
            unsubscribe();
          },
        });

        directCall.accept();
      },
    });
  };
  const userAuthenticate = async (userid, token) => {
    try {
      const user = await SendbirdCalls.authenticate({
        userId: 'sendbird_desk_agent_id_67d1f4d8-5bc9-4356-81b6-45b622198717',
        accessToken: '10e17e4f4deb0cb4116dee1de31f43ce92feb8c6',
      });
      console.log('User authenticated:', user);
    } catch (e) {
      console.error('Authentication error:', e);
    }
  };

  const getCurrentUser = async () => {
    const res = await SendbirdCalls.getCurrentUser();
    console.log(res, 'currentUser');
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
