import React, {useState, useEffect} from 'react';
import {Image, ImageStyle, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

type Props = {
  type: 'STAR' | 'SHARE' | 'BELL' | 'CHECK' | 'DOCUMENT';
  width?: number;
  height?: number;
  color?: string;
};

const getIconImage = (type: Props['type']) => {
  switch (type) {
    case 'BELL':
      return require('./../../images/icon/bell.png');
    case 'CHECK':
      return require('./../../images/icon/check.png');
    case 'SHARE':
      return require('./../../images/icon/share.png');
    case 'STAR':
      return require('./../../images/icon/star.png');
    case 'DOCUMENT':
      return require('./../../images/icon/document.png');
    default:
      throw new Error('GET ICON IMAGE ERROR :: CUSTOM ICON TSX');
  }
};

const CustomIcon = ({type, width = 25, height = 25, color}: Props) => {
  return (
    <FastImage
      source={getIconImage(type)}
      style={[{width: width, height: height}]}
    />
  );
};

const styles = StyleSheet.create({});

export default CustomIcon;
