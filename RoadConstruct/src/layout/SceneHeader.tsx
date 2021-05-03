import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';

import Typho from '~/Typho';
import {toastAlert} from '~/util';

import Icon_FontAwesome from 'react-native-vector-icons/FontAwesome';
import FastImage from 'react-native-fast-image';
import CustomIcon from '~/atom/CustomIcon';
import {useNavigation} from '@react-navigation/native';
import GlobalEnum from '~/GlobalEnum';

type Props = {
  scene?: any;
  previous?: any;
  handleShare?: () => any;
  handleGotoAlarm?: () => any;
};

const SceneHeader = ({handleShare = () => toastAlert('TODO')}: Props) => {
  const navigation = useNavigation();
  const handleGoToAlarm = () => {
    navigation.navigate(GlobalEnum.Route.ALARM_SETTING);
  };
  return (
    <>
      <View style={[ST.container]}>
        <View style={ST.left_side}>
          <TouchableNativeFeedback
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{name: GlobalEnum.Route.MAIN_SCENE}],
              });
            }}>
            <FastImage
              source={require('./../../images/logo.png')}
              style={{
                width: 30,
                height: 30,
                borderRadius: 5,
              }}
            />
          </TouchableNativeFeedback>

          <Typho type={'H4'} text={'도로신설소식'} extraStyle={ST.buttonText} />
        </View>
        <View style={ST.button_container}>
          <TouchableOpacity
            style={ST.icon_buton}
            onPress={() => handleGoToAlarm()}>
            <CustomIcon type={'BELL'} />
          </TouchableOpacity>
          <TouchableOpacity style={ST.icon_buton} onPress={() => handleShare()}>
            <CustomIcon type={'SHARE'} />
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
    color: 'black',
    fontSize: 16,
  },
});

export default SceneHeader;
