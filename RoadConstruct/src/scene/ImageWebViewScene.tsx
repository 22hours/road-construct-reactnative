import React, {useRef} from 'react';
import {StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

type Props = {
  route: {
    params: any;
  };
};

const ImageWebViewScene = ({route}: Props) => {
  const {image_uri} = route.params;
  const webViewRef = useRef<WebView | null>(null);
  return (
    <WebView
      ref={webViewRef}
      source={{
        uri: image_uri,
      }}
    />
  );
};

const styles = StyleSheet.create({});

export default ImageWebViewScene;
