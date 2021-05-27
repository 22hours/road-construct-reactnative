import React, {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';

/// ORGANIMS
import MapWebView from '~/organism/MapWebView';

// ENUM
import {API_CALL} from '~/api';
import {toastAlert} from '~/util';
import {api_types} from '@global_types';
import {useLoader} from '~/store/AppGlobalLoadingStore';

type Props = {
  route: any;
};

type position = {
  latitude: number;
  longitude: number;
};
type Marker_list = Array<api_types.article_marker>;

const MapScene = () => {
  const loaderDispatch = useLoader();
  const [markerList, setMarkerList] = useState<Marker_list | null>(null);

  const getArticleMarkerList = async () => {
    loaderDispatch({
      type: 'SHOW_LOADER',
      text: '소식 데이터 불러오는 중',
    });
    var rest_data = await API_CALL('get', 'MAIN_HOST', 'ARTICLE MARKER LIST');
    loaderDispatch({type: 'HIDE_LOADER'});

    if (rest_data) {
      if (rest_data.result === 'SUCCESS') {
        var marker_data = rest_data.data;
        setMarkerList(marker_data);
      } else {
        toastAlert(
          '지도 데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요',
        );
      }
    }
  };

  // STEP 1
  useEffect(() => {
    getArticleMarkerList();
  }, []);

  return <>{markerList && <MapWebView markerList={markerList} />}</>;
};

export default MapScene;
