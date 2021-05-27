import React from 'react';
import {ActivityIndicator, StyleSheet, View, Dimensions} from 'react-native';

import {useLoaderState} from '~/store/AppGlobalLoadingStore';
import Typho from '~/Typho';

let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;

type Props = {};

const GlobalLoader = () => {
  const {isLoading, text} = useLoaderState();
  return (
    <>
      {isLoading && (
        <View style={ST.container}>
          <View style={ST.loading}>
            <ActivityIndicator color="white" />
            <Typho
              type={'H5'}
              text={text ? text : '잠시만 기다려 주세요'}
              extraStyle={ST.loadingTitle}
            />
          </View>
        </View>
      )}
    </>
  );
};

const ST = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  loading: {
    backgroundColor: '#10101099',
    height: 80,
    width: 200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: (height - 80) / 2,
    left: (width - 200) / 2,
  },

  loadingTitle: {
    marginTop: 10,
    fontSize: 14,
    color: 'white',
  },
});

export default GlobalLoader;
