import React, {useState, useEffect} from 'react';
import ImageModal from 'react-native-image-modal';
import {Dimensions, Image, Text, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

// ENUMS
import GlobalEnum from '~/GlobalEnum';

const ArticleImage = React.memo(({img}: {img: string | any}) => {
  const navigation = useNavigation();

  var dimension_width = Dimensions.get('window').width;

  const [imgSize, setImgSize] = useState({
    width: dimension_width - 40,
    height: 250,
  });

  useEffect(() => {
    if (img) {
      Image.getSize(img, (real_width, real_height) => {
        const ratio = dimension_width / real_width;
        const result_width = dimension_width - 40;
        const result_height = real_height * ratio - 40;

        setImgSize({width: result_width, height: result_height});
      });
    }
  }, [img]);
  return (
    <>
      {/* 웹뷰 방식 (현재) */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(GlobalEnum.Route.IMAGE_WEBVIEW_SCENE, {
            image_uri: img,
          })
        }>
        <FastImage
          style={[{width: imgSize.width, height: imgSize.height, marginTop: 0}]}
          source={{uri: img}}
        />
      </TouchableOpacity>
      <View style={{paddingTop: 10}} />
      {/* 모달 방식 (기존) */}
      {/* <ImageModal
        swipeToDismiss={true}
        resizeMode="contain"
        style={[{width: imgSize.width, height: imgSize.height, marginTop: 0}]}
        source={{uri: img}}
      /> */}
    </>
  );
});

export default ArticleImage;
