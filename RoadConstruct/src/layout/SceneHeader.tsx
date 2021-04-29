import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import Typho from '~/Typho';
import {toastAlert} from '~/util';

import Icon_FontAwesome from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';

type Props = {
  scene?: any;
  previous?: any;
  navigation?: any;
  handleShare?: () => any;
  handleGotoAlarm?: () => any;
};

const SceneHeader = ({
  handleGotoAlarm = () => toastAlert('TODO'),
  handleShare = () => toastAlert('TODO'),
}: Props) => {
  return (
    <>
      <View
        // start={{x: 0, y: 0}}
        // end={{x: 1, y: 0}}
        // colors={['#1E3C72', '#2A5298']}
        style={[ST.container]}>
        <View style={ST.left_side}>
          <FastImage
            source={require('./../../images/logo.png')}
            style={{
              width: 30,
              height: 30,
              borderRadius: 5,
            }}
          />
          <Typho type={'H4'} text={'도로신설소식'} extraStyle={ST.buttonText} />
        </View>
        <View style={ST.button_container}>
          <TouchableOpacity
            style={ST.icon_buton}
            onPress={() => handleGotoAlarm()}>
            <Icon_FontAwesome name="bell" style={ST.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={ST.icon_buton} onPress={() => handleShare()}>
            <Icon_FontAwesome name="share-square-o" style={ST.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const ST = StyleSheet.create({
  container: {
    height: 50,
    elevation: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  left_side: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    marginLeft: 10,
  },
  button_container: {
    flexDirection: 'row',
  },

  icon_buton: {
    // borderWidth: 1,
    // borderColor: 'red',
    padding: 10,
  },
  icon: {
    color: 'white',
    fontSize: 16,
  },
});

export default SceneHeader;
