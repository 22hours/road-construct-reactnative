import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
} from 'react-native';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';

const ViewShareTest = () => {
  const captureRef = useRef<any>(null);

  const getPhotoUri = async (): Promise<string> => {
    const uri = await captureRef.current.capture();

    console.log('👂👂 Image saved to', uri);
    return uri;
  };

  const onCapture = async (social: Share.Social | null) => {
    try {
      const uri = await getPhotoUri();

      const options = {
        title: 'Share Title',
        message: 'Share Message',
        url: uri,
        type: 'image/jpeg',
      };

      if (social === null) {
        const result = await Share.open(options);
        console.log('😻😻 result with no social', result);
      } else {
        const result = await Share.shareSingle({
          ...options,
          social,
        });
        console.log(`😻😻 result with social ${social}`, result);
      }
    } catch (e) {
      console.log('😻😻😻 snapshot failed', e);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <ViewShot ref={captureRef} options={{format: 'jpg', quality: 0.9}}>
        <View style={{backgroundColor: 'yellow'}}>
          <Text>이 화면이 공유됩니다</Text>
          <TouchableOpacity
            style={{marginTop: 20, padding: 20}}
            onPress={() => onCapture(null)}>
            <Text>SHOT!</Text>
          </TouchableOpacity>
        </View>
      </ViewShot>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default ViewShareTest;
