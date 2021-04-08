import React, {useState, useEffect} from 'react';
import ImageModal from 'react-native-image-modal';
import {Dimensions, Image} from 'react-native';

const ArticleImage = React.memo(({img}: {img: string | any}) => {
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
    <ImageModal
      swipeToDismiss={true}
      resizeMode="contain"
      style={[{width: imgSize.width, height: imgSize.height, marginTop: 0}]}
      source={{uri: img}}
    />
  );
});

export default ArticleImage;
