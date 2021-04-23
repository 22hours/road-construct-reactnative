import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useNavigation} from '@react-navigation/native';

/// ORGANIMS
import ArticleMap from '~/organism/ArticleMap';
import MapWebView from '~/organism/MapWebView';

// LAYOUT
import SceneLayout from '~/layout/SceneLayout';

// ENUM
import GlobalEnum from '~/GlobalEnum';

type Props = {
  route: any;
};

type MapType = 'ARTICLE_LIST' | 'ARTICLE_DETAIL';

type ArticleListMapProps = {
  start_coords: {
    latitude: number;
    longitude: number;
  };
};

type ArticleDetailMapProps = {
  start_coords: {
    latitude: number;
    longitude: number;
  };
};

const MapScene = ({route}: Props) => {
  const navigation = useNavigation();
  const {type} = route?.params;
  const [mapProps, setMapProps] = useState<
    ArticleListMapProps | ArticleDetailMapProps
  >();

  const setArticleListMapProps = () => {
    Geolocation.getCurrentPosition(
      position => {
        setMapProps({
          start_coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        });
      },
      error => {
        Alert.alert(
          'GPS 서비스 오류',
          'GPS 서비스에 오류가 발생하였습니다\n핸드폰의 GPS설정을 확인한 뒤, 지도를 다시 열어 주세요',
        );
        navigation.goBack();
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const setArticleDetailMapProps = () => {
    console.log('TODO');
  };

  useEffect(() => {
    if (type === 'ARTICLE_LIST') {
      setArticleListMapProps();
    } else {
      setArticleDetailMapProps();
    }
  }, []);

  return <>{mapProps && <MapWebView {...mapProps} />}</>;
};

const styles = StyleSheet.create({});

export default MapScene;
