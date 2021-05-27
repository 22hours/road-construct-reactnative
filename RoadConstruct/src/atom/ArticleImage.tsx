import React, {useState, useEffect} from 'react';
import {Dimensions, Image, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';

// ENUMS
import GlobalEnum from '~/GlobalEnum';

const ArticleImage = React.memo(({img}: {img: string | any}) => {
  const [localImg, setLocalImg] = useState<string>('');

  const navigation = useNavigation();

  var dimension_width = Dimensions.get('window').width;

  const [imgSize, setImgSize] = useState({
    width: dimension_width - 40,
    height: 250,
  });

  useEffect(() => {
    if (img) {
      let regex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
      if (regex.test(img)) {
        setLocalImg(img);
      } else {
        setLocalImg(
          'https://images.unsplash.com/photo-1622046016568-ff3842481d42?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
        );
      }
    }
  }, [img]);

  useEffect(() => {
    if (localImg.length > 1) {
      Image.getSize(localImg, (real_width, real_height) => {
        const ratio = dimension_width / real_width;
        const result_width = dimension_width - 40;
        const result_height = real_height * ratio - 40;

        setImgSize({width: result_width, height: result_height});
      });
    }
  }, [localImg]);
  return (
    <>
      {/* 웹뷰 방식 (현재) */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(GlobalEnum.Route.IMAGE_WEBVIEW_SCENE, {
            image_uri: localImg,
          })
        }>
        {localImg.length > 1 && (
          <FastImage
            style={[
              {width: imgSize.width, height: imgSize.height, marginTop: 0},
            ]}
            source={{uri: localImg}}
            onError={() => console.log('IMAGE ERROR!!!')}
          />
        )}
      </TouchableOpacity>
      <View style={{paddingTop: 10}} />
    </>
  );
});

export default ArticleImage;
