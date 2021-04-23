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

  const handlePostMessage = () => {};

  const handleOnMessage = ({nativeEvent: {data}}) => {
    console.log(data);
  };

  return (
    <>
      <MapPannel mapType={mapType} setMapType={handleMapType} />
      <WebView
        ref={webViewRef}
        onMessage={handleOnMessage}
        source={{
          uri: 'http://10.0.2.2:3000',
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({});

export default MapWebView;
