import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Typho from '~/Typho';
import {toastAlert} from '~/util';

import Icon_FontAwesome from 'react-native-vector-icons/FontAwesome';

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
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={['#1E3C72', '#2A5298']}
        style={[ST.linearGradient, ST.container]}>
        <Typho type={'H4'} text={'도로개발소식'} extraStyle={ST.buttonText} />
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
      </LinearGradient>
    </>
  );
};

const ST = StyleSheet.create({
  container: {
    height: 50,
    elevation: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  buttonText: {
    color: 'white',
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
