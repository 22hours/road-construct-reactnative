import {api_types} from '@global_types';
import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {API_CALL} from '~/api';

// LAYOUT
import SceneLayout from '~/layout/SceneLayout';
import MediaListItem from '~/molecule/MediaListItem';
import {useLoader} from '~/store/AppGlobalLoadingStore';
import Typho from '~/Typho';
type Props = {
  route?: any;
};

const ArticleNewsScene = ({route}: Props) => {
  const loaderDispatch = useLoader();
  const navigation = useNavigation();
  const article_id = route?.params?.article_id;
  const [state, setState] = useState<api_types.api_response__article_news>([]);

  const getArticleNewsData = async () => {
    loaderDispatch({type: 'SHOW_LOADER'});
    const rest_data = await API_CALL(
      'get',
      'MAIN_HOST',
      'ARTICLE NEWS LIST',
      article_id,
    );
    loaderDispatch({type: 'HIDE_LOADER'});

    if (rest_data) {
      if (rest_data.result === 'SUCCESS') {
        var data = rest_data.data;
        setState(data);
      } else {
        Alert.alert('삭제된 소식이거나, 관련기사를 가져올 수 없습니다');
        navigation.goBack();
      }
    }
  };

  useEffect(() => {
    if (article_id) {
      getArticleNewsData();
    }
  }, [article_id]);

  return (
    <SceneLayout isScrollAble={true}>
      <>
        <Typho type={'H4'} text={'관련 기사'} extraStyle={{marginBottom: 20}} />
        {state.length >= 1 &&
          state.map((it, idx) => (
            <MediaListItem
              key={`ARTICLE_MEDIA::${idx}`}
              {...it}
              media_id={idx}
            />
          ))}
      </>
    </SceneLayout>
  );
};

const styles = StyleSheet.create({});

export default ArticleNewsScene;
