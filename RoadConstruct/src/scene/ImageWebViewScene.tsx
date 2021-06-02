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
  const html = `
  <!DOCTYPE html>
<html lang="en" style="height: 100%;"> 
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, minimum-scale=0.1">    <title>Document</title>
    <style>
      body {
        margin: 0px; background: #0e0e0e; height: 100%
      }
    </style>
  </head>
  <body>
    <img
      src=${image_uri}
    />
  </body>
</html>

  `;
  const webViewRef = useRef<WebView | null>(null);
  return (
    <WebView
      ref={webViewRef}
      source={{
        html: html,
      }}
    />
  );
};

const styles = StyleSheet.create({});

export default ImageWebViewScene;
