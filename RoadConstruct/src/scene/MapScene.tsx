import React, {useState, useEffect} from 'react';

/// ORGANIMS
import MapWebView from '~/organism/MapWebView';

// ENUM
import {API_CALL} from '~/api';
import {toastAlert} from '~/util';
import {api_types} from '@global_types';
import {useLoader} from '~/store/AppGlobalLoadingStore';
import {useLocation} from '~/Hooks';

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

const MapScene = () => {
  const loaderDispatch = useLoader();
  const [markerList, setMarkerList] = useState<Marker_list | null>(null);

  const location = useLocation();

  const getArticleMarkerList = async () => {
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
    console.log(location);
    return (
      <>
        {markerList && (
          <MapWebView markerList={markerList} location={location} />
        )}
      </>
    );
  } else {
    return <></>;
  }
};

export default MapScene;
