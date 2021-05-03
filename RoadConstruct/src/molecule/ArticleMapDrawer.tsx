import {api_types} from '@global_types';
import React, {useState, useEffect, useMemo} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableNativeFeedback,
} from 'react-native';
import {API_CALL} from '~/api';
import Color from '~/Color';
import Typho from '~/Typho';
import Icon_Entypo from 'react-native-vector-icons/Entypo';
import Icon_AntDesign from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import GlobalEnum from '~/GlobalEnum';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import axios from 'axios';

let axiosSource = axios.CancelToken.source();

// LAYOUT
type Props = {
  initOverlayState: () => void;
  article_id: number | null;
  isVisible: boolean;
};

type State = api_types.article_marker_detail | null;

const ArticleMapDrawer = React.memo(
  ({article_id, isVisible, initOverlayState}: Props) => {
    const navigation = useNavigation();
    const [state, setState] = useState<State>(null);

    const getArticleData = useMemo(async () => {
      if (article_id !== null) {
        const rest_data = await API_CALL(
          'get',
          'MAIN_HOST',
          'ARTICLE_DETAIL_MARKER',
          undefined,
          {article_id: article_id},
        );

        if (rest_data) {
          if (rest_data.result === 'SUCCESS') {
            return rest_data.data;
          } else {
          }
        }
      } else {
        return null;
      }
    }, [article_id]);

    const setArticleData = async () => {
      const data = await getArticleData;
      if (state !== data) {
        setState(data);
      }
    };

    useEffect(() => {
      return () => {
        if (axiosSource) {
          axiosSource.cancel('Landing Component got unmounted');
        }
      };
    }, []);

    useEffect(() => {
      if (!isVisible) {
        if (axiosSource) {
          axiosSource.cancel('Landing Component got unmounted');
        }
        setState(null);
      }
    }, [isVisible]);

    useEffect(() => {
      if (article_id !== null) {
        setArticleData();
      }
    }, [article_id]);

    return (
      <View>
        {isVisible && (
          <>
            {state ? (
              <>
                <View style={ST.container}>
                  <TouchableNativeFeedback onPress={() => initOverlayState()}>
                    <View style={ST.close_container}>
                      <Typho
                        type={'LABEL'}
                        text={'취소'}
                        extraStyle={ST.close_container__text}
                      />
                      <Icon_AntDesign
                        name="closecircleo"
                        style={[
                          ST.close_container__text,
                          {marginLeft: 10, marginTop: 2},
                        ]}
                      />
                    </View>
                  </TouchableNativeFeedback>
                  <TouchableNativeFeedback
                    onPress={() => {
                      navigation.navigate(GlobalEnum.Route.ARTICLE_DETAIL, {
                        article_id: article_id,
                      });
                    }}>
                    <View style={ST.main_container}>
                      <View style={ST.content_wrapper}>
                        <View style={ST.bar_wrapper}>
                          <View style={ST.bar}></View>
                        </View>

                        <View style={ST.header}>
                          <Typho
                            type={'H3'}
                            text={state.title}
                            extraStyle={ST.title}
                          />
                        </View>
                        <Typho
                          type={'H5'}
                          text={state.summary}
                          extraStyle={ST.summary}
                        />
                        <View style={ST.footer}>
                          <Icon_Entypo
                            name="chevron-up"
                            style={[ST.footer_text, {marginRight: 5}]}
                          />
                          <Typho
                            type={'LABEL'}
                            text={'자세히 보기'}
                            extraStyle={ST.footer_text}
                          />
                        </View>
                      </View>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              </>
            ) : (
              <>
                <View style={ST.container}>
                  <View style={ST.main_container}>
                    <SkeletonPlaceholder>
                      <View
                        style={{
                          marginVertical: 20,
                          marginHorizontal: 20,
                          flexDirection: 'column',
                        }}>
                        <SkeletonPlaceholder.Item flexDirection="column">
                          <SkeletonPlaceholder.Item
                            width={200}
                            height={30}
                            borderRadius={4}
                            marginBottom={5}
                          />
                          <SkeletonPlaceholder.Item
                            width={300}
                            height={20}
                            borderRadius={4}
                            marginBottom={5}
                          />
                          <SkeletonPlaceholder.Item
                            width={100}
                            height={20}
                            borderRadius={4}
                          />
                        </SkeletonPlaceholder.Item>
                      </View>
                    </SkeletonPlaceholder>
                  </View>
                </View>
              </>
            )}
          </>
        )}
      </View>
    );
  },
);

const ST = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  close_container: {
    position: 'absolute',
    backgroundColor: 'white',
    elevation: 11,
    bottom: 140,

    paddingHorizontal: 20,
    paddingVertical: 5,
    zIndex: 1,
    borderRadius: 10,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  close_container__text: {
    fontSize: 15,
    color: 'gray',
  },
  main_container: {
    position: 'absolute',
    backgroundColor: 'white',
    elevation: 11,
    bottom: -20,
    left: 0,
    right: 0,
    height: 150,
    zIndex: 1,
    borderRadius: 25,
    overflow: 'hidden',
  },
  bar_wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    borderRadius: 5,
    backgroundColor: Color.COMMON.BORDER,
    height: 5,
    width: 100,
  },
  content_wrapper: {
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  header: {marginTop: 10, flexDirection: 'row'},
  title: {fontSize: 23, color: 'black'},
  summary: {color: 'gray'},
  footer: {
    flexDirection: 'row',
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer_text: {color: 'gray', fontSize: 12},
});

export default ArticleMapDrawer;
