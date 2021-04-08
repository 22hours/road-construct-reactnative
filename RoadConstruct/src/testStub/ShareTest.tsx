import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Share from 'react-native-share';
import ImgToBase64 from 'react-native-image-base64';

const ShareTest = () => {
  const LibShare = async () => {
    const img =
      'https://static.npmjs.com/attachments/ck3uweazy72ye8874y9kkxnx1-gak.png';
    const type = 'image/png';
    const imguri = await ImgToBase64.getBase64String(img)
      .then((base64String: any) => base64String)
      .catch((err: any) => err);

    const options = {
      message: 'HI',
      url: `data:image/png;base64,${imguri}`,
    };
    Share.open(options);
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => LibShare()}>
        <Text>SHARE !</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default ShareTest;
