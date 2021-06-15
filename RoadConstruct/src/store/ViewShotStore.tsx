import React, {useRef, useEffect, useContext} from 'react';
import {View} from 'react-native';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import SceneHeader from '~/layout/SceneHeader';
import {useNavigation} from '@react-navigation/native';

// CONTEXT
const ViewShotContext = React.createContext<any>(null);

export const ViewShotProvider = ({children}) => {
  const captureRef = useRef<any>(null);
  const navigation = useNavigation();

  const getPhotoUri = async (): Promise<string> => {
    const uri = await captureRef.current.capture();
    return uri;
  };
  const onCapture = async (social: Share.Social | null) => {
    try {
      const uri = await getPhotoUri();
      const options = {
        title: '도로 신설 소식 공유',
        message: '도로신설소식에서 공유하였습니다',
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
    <ViewShotContext.Provider value={onCapture}>
      <ViewShot ref={captureRef} options={{format: 'png'}}>
        <View style={{flex: 1, backgroundColor: 'rgb(250,250,250)'}}>
          {children}
        </View>
      </ViewShot>
    </ViewShotContext.Provider>
  );
};

export const useArticleDetailViewShot = () => {
  const state = useContext(ViewShotContext);
  if (!state) {
    throw new Error('Cannot find ViewShotProvider');
  }
  return state;
};
