import {api_types} from '@global_types';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import ArticleMapDrawer from '~/molecule/ArticleMapDrawer';
import MapPannel from '~/molecule/MapPannel';
import {useLoader} from '~/store/AppGlobalLoadingStore';
import {toastAlert} from '~/util';

type Props = {
  markerList: Array<api_types.article_marker>;
};

type mapType = 'normal' | 'hybrid' | 'terrain';

const MapWebView = ({markerList}: Props) => {
  const [mapType, setMapType] = useState<mapType>('normal');
  const [
    isCadastralLayerVisible,
    setIsCadastralLayerVisible,
  ] = useState<boolean>(false);

  const loaderDispatch = useLoader();
  const [overlayState, setOverlayState] = useState<{
    article_id: number | null;
    isVisible: boolean;
  }>({
    article_id: null,
    isVisible: false,
  });

  const webViewRef = useRef<WebView | null>(null);

  ////////////////////////////////////////////////////////////////////
  // SEND MESSAGE
  type sendPostMessageAction =
    | {type: 'LOAD_MARKERS'; data: any}
    | {type: 'SET_MAP_TYPE'; data: any}
    | {type: 'TOGGLE_CADASTRAL'}
    | {type: 'MOVE_CURRENT_LOCATION'};

  const sendPostMessageToWeb = (action: sendPostMessageAction) => {
    var res_value: any = null;
    var callBackAction: () => void = () => toastAlert('TODO');
    switch (action.type) {
      case 'LOAD_MARKERS': {
        res_value = {type: action.type, data: markerList};
        break;
      }
      case 'SET_MAP_TYPE': {
        res_value = {type: action.type, data: action.data};
        callBackAction = () => setMapType(action.data);
        break;
      }
      case 'TOGGLE_CADASTRAL': {
        res_value = {type: action.type};
        callBackAction = () =>
          setIsCadastralLayerVisible(!isCadastralLayerVisible);
        break;
      }
      case 'MOVE_CURRENT_LOCATION': {
        sendPostMessageToWeb({type: 'MOVE_CURRENT_LOCATION'});
        break;
      }
      default:
        throw new Error('TYPE ERROR : DISPATCH POST MESSAGE :: MAPWEBVIEW');
    }
    if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify(res_value));
      callBackAction();
    }
  };

  ////////////////////////////////////////////////////////////////////
  // RECIVE MESSAGE
  type recivePostMessageAction =
    | {type: 'MAP_LOAD_END'}
    | {type: 'CLICK_MARKER'; data: any}
    | {type: 'CLICK_MAP'};
  const recivePostMessageFromWeb = (action: recivePostMessageAction) => {
    switch (action.type) {
      case 'MAP_LOAD_END': {
        loaderDispatch({type: 'HIDE_LOADER'});
        sendPostMessageToWeb({type: 'LOAD_MARKERS', data: markerList});
        break;
      }
      case 'CLICK_MARKER': {
        setOverlayState({
          article_id: action.data.article_id,
          isVisible: true,
        });
        break;
      }
      case 'CLICK_MAP': {
        setOverlayState({
          article_id: null,
          isVisible: false,
        });
        break;
      }
      default: {
        return;
      }
    }
  };

  // PROPS DISPATCH
  const toggleCadastralLayerVisible = useCallback(() => {
    sendPostMessageToWeb({type: 'TOGGLE_CADASTRAL'});
  }, []);
  const initOverlayState = useCallback(() => {
    setOverlayState({
      article_id: null,
      isVisible: false,
    });
  }, []);
  const handleOnMessage = useCallback(({nativeEvent: {data}}) => {
    try {
      var data_obj = JSON.parse(data);
      console.log(data_obj);
      recivePostMessageFromWeb(data_obj);
    } catch {
      toastAlert('현재 지도 서버에 문제가있습니다.');
    }
  }, []);

  useEffect(() => {
    // loaderDispatch({type: 'SHOW_LOADER'});
    return () => {
      loaderDispatch({type: 'HIDE_LOADER'});
    };
  }, []);
  return (
    <>
      <MemoizedWebview
        webViewRef={webViewRef}
        handleOnMessage={handleOnMessage}
      />
      <MapPannel
        mapType={mapType}
        setMapType={(type: mapType) =>
          sendPostMessageToWeb({type: 'SET_MAP_TYPE', data: type})
        }
        isCadastralLayerVisible={isCadastralLayerVisible}
        toggleCadastralLayerVisible={toggleCadastralLayerVisible}
      />
      <ArticleMapDrawer {...overlayState} initOverlayState={initOverlayState} />
    </>
  );
};

const MemoizedWebview = React.memo(
  ({
    webViewRef,
    handleOnMessage,
  }: {
    webViewRef: React.MutableRefObject<WebView<{}> | null>;
    handleOnMessage: (event: WebViewMessageEvent) => void;
  }) => {
    return (
      <WebView
        ref={webViewRef}
        onMessage={handleOnMessage}
        source={{
          uri: 'https://64a73af10800.ngrok.io',
        }}
      />
    );
  },
);

export default MapWebView;
