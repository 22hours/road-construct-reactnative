import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

import SceneHeader from '~/layout/SceneHeader';

type Props = {
  children: JSX.Element;
  navigation: any;
};

const ViewShotArea = ({children, navigation}: Props) => {
  const captureRef = useRef<any>(null);

  const getPhotoUri = async (): Promise<string> => {
    const uri = await captureRef.current.capture();
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
      } else {
        const result = await Share.shareSingle({
          ...options,
          social,
        });
      }
    } catch (e) {
      console.log('😻😻😻 snapshot failed', e);
    }
  };
  useEffect(() => {
    navigation.setOptions({
      header: () => <SceneHeader handleShare={() => onCapture(null)} />,
    });
  }, []);
  return (
    <ViewShot ref={captureRef} options={{format: 'webm'}}>
      <View style={{flex: 1, backgroundColor: 'rgb(250,250,250)'}}>
        {children}
      </View>
    </ViewShot>
  );
};

const styles = StyleSheet.create({});

export default ViewShotArea;
