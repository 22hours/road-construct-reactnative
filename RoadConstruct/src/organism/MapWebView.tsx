import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {WebView} from 'react-native-webview';
import MapPannel from '~/molecule/MapPannel';

type Props = {};

const MapWebView = (props: Props) => {
  const [mapType, setMapType] = useState<number>(0);
  const [
    isCadastralLayerVisible,
    setIsCadastralLayerVisible,
  ] = useState<boolean>(false);

  const webViewRef = useRef<WebView | null>(null);

  const handleMapType = (mapType: number) => {
    var eng_map_type: string = 'normal';
    if (mapType === 0) eng_map_type = 'normal';
    else if (mapType === 2) eng_map_type = 'satellite';
    else if (mapType === 4) eng_map_type = 'terrain';

    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({type: 'SET_MAP_TYPE', value: eng_map_type}),
      );
      setMapType(mapType);
    }
  };
  const toggleCadastralLayerVisible = () => {
    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({type: 'TOGGLE_CADASTRAL'}),
      );
      setIsCadastralLayerVisible(!isCadastralLayerVisible);
    }
  };

  const handlePostMessage = () => {};

  const handleOnMessage = ({nativeEvent: {data}}) => {
    console.log(data);
  };

  const handleLoadMarker = () => {
    const first_markers = [
      {
        article_id: 1,
        shorten_address: '도로개설1',
        latitude: 37.3595704,
        longitude: 127.105399,
      },
      {
        article_id: 2,
        shorten_address: '도로개설2',
        latitude: 37.3699814,
        longitude: 127.106399,
      },
      {
        article_id: 3,
        shorten_address: '도로개설3',
        latitude: 37.3690926,
        longitude: 127.105399,
      },
    ];

    if (webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({type: 'LOAD_MARKERS', value: first_markers}),
      );
      setIsCadastralLayerVisible(!isCadastralLayerVisible);
    }
  };

  useEffect(() => {
    // handleLoadMarker();
  }, []);

  return (
    <>
      <MapPannel
        mapType={mapType}
        setMapType={handleMapType}
        isCadastralLayerVisible={isCadastralLayerVisible}
        toggleCadastralLayerVisible={toggleCadastralLayerVisible}
      />
      <WebView
        ref={webViewRef}
        onMessage={handleOnMessage}
        source={{
          uri: 'https://b25e64afa9c9.ngrok.io',
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({});

export default MapWebView;
