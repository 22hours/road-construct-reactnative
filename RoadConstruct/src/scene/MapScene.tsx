import React, {useState, useEffect} from 'react';
import {PermissionsAndroid, Alert, BackHandler} from 'react-native';
/// ORGANIMS
import MapWebView from '~/organism/MapWebView';

// ENUM
import {API_CALL} from '~/api';
import {toastAlert} from '~/util';
import {api_types} from '@global_types';
import {useLoader} from '~/store/AppGlobalLoadingStore';
import {useLocation} from '~/Hooks';
import {Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

type Props = {
  route: any;
};

type position = {
  latitude: number;
  longitude: number;
};

type State = {
  marker_list: Marker_list;
  location: position;
};
type Marker_list = Array<api_types.article_marker>;

const MapController = () => {
  const loaderDispatch = useLoader();
  const [markerList, setMarkerList] = useState<Marker_list | null>(null);

  const location = useLocation();

  const getArticleMarkerList = async () => {
    console.log('HA!');
    loaderDispatch({
      type: 'SHOW_LOADER',
      text: '소식 데이터 불러오는 중',
    });
    var rest_data = await API_CALL('get', 'MAIN_HOST', 'ARTICLE MARKER LIST');
    loaderDispatch({
      type: 'HIDE_LOADER',
    });
    if (rest_data) {
      if (rest_data.result === 'SUCCESS') {
        console.log('GET MARKERS : ', rest_data.data);
        setMarkerList(rest_data.data);
      } else {
        toastAlert(
          '지도 데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요',
        );
        setMarkerList([]);
      }
    }
  };

  // STEP 1
  useEffect(() => {
    getArticleMarkerList();
  }, []);

  if (markerList && location) {
    return (
      <View style={{flex: 1}}>
        {markerList ? (
          <MapWebView markerList={markerList} location={location} />
        ) : (
          <View>
            <Text>마커 데이터가 없습ㄴ디ㅏ</Text>
          </View>
        )}
      </View>
    );
  } else {
    return <></>;
  }
};

const PermissionProvider = ({children}: {children: JSX.Element}) => {
  const navigation = useNavigation();
  const [isGranted, setIsGranted] = useState<'WAIT' | 'SUCCESS' | 'FAIL'>(
    'WAIT',
  );

  const requestFineLocation = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setIsGranted('SUCCESS');
      } else {
        setIsGranted('FAIL');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    requestFineLocation();
  }, []);

  useEffect(() => {
    if (isGranted === 'FAIL') {
      Alert.alert(
        '위치 권한 실패',
        '지도를 사용하기 위해서는 위치권한이 필요합니다\n"지도보기" 버튼을 다시눌러 위치권한을 활성화 해 주세요',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    }
  }, [isGranted]);

  if (isGranted === 'WAIT') {
    return <></>;
  }
  if (isGranted === 'FAIL') {
    return <></>;
  }
  if (isGranted === 'SUCCESS') {
    return <>{children}</>;
  }
};

const MapScene = () => {
  return (
    <PermissionProvider>
      <MapController />
    </PermissionProvider>
  );
};

export default MapScene;
