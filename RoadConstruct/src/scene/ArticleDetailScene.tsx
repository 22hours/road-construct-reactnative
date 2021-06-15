import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Linking,
  Dimensions,
} from 'react-native';

// STORE
import {
  ArticleDetailProvider,
  useArticleDetailStoreState,
} from '~/store/ArticleDetailStore';

// ENUM
import GlobalEnum from '~/GlobalEnum';
import {api_types} from '@global_types';

// LAYOUT
import SceneLayout from '~/layout/SceneLayout';

//TEST
import Color from '~/Color';
import Typho from '~/Typho';

// ATOMS
import ArticleButton from '~/atom/ArticleButton';
import AddressText from '~/molecule/AddressText';
import ArticleImage from '~/atom/ArticleImage';
import CustomIcon from '~/atom/CustomIcon';

import {toastAlert} from '~/util';
import {useNavigation} from '@react-navigation/native';

// ICONS
import Icon_AntDesign from 'react-native-vector-icons/AntDesign';
import {
  useArticleDetailViewShot,
  ViewShotProvider,
} from '~/store/ViewShotStore';
import {API_CALL} from '~/api';
import {useLoader} from '~/store/AppGlobalLoadingStore';

type DATA_Type = api_types.api_response__article_detail;

////////////////////////////////////////////////////
//  COMMON
////////////////////////////////////////////////////
const ArticleSection = ({
  section_title,
  section_tooltip,
  section_bodies,
  isFinal = false,
}: {
  section_title: string;
  section_tooltip?: JSX.Element;
  section_bodies: Array<JSX.Element>;
  isFinal?: boolean;
}) => {
  return (
    <View
      style={[
        ST.section_wrapper,
        isFinal && {borderBottomWidth: 0, marginBottom: 5},
      ]}>
      <View style={ST.section_header_wrapper}>
        <Text style={ST.section_header}>
          <Typho
            type={'SECTION_HEADER'}
            text={section_title}
            extraStyle={ST.section_header__text}
          />
        </Text>
        {section_tooltip || <></>}
      </View>
      {section_bodies?.map((it, idx) => {
        var extraStyle = idx === section_bodies.length - 1 && {marginBottom: 0};
        return (
          <View key={idx} style={[ST.section_body_item, extraStyle]}>
            {it}
          </View>
        );
      })}
    </View>
  );
};

////////////////////////////////////////////////////
//  SCENE COMPONENT
////////////////////////////////////////////////////
const SECITON__TOPIC_CONTENT = React.memo(() => {
  const navigation = useNavigation();
  const state: DATA_Type['topic_content'] = useArticleDetailStoreState(
    'TOPIC_CONTENT',
  );

  const handlePressPDF = () => {
    var pdf_length = state.article_file_list?.length;
    if (pdf_length >= 1) {
      var origin_pdf_file_url = state.article_file_list[0].url;
      navigation.navigate(GlobalEnum.Route.PDF_SCENE, {
        origin_pdf_uri: origin_pdf_file_url,
        pdf_uri_list: state.article_file_list,
      });
    } else {
      toastAlert('등록된 원문이 없습니다');
    }
  };
  return (
    <ArticleSection
      section_title={'주요 내용'}
      section_bodies={
        state && [
          <View
            key={1}
            style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Typho
              type={'H5'}
              text={state.content}
              extraStyle={{color: 'black'}}
            />
            {state.article_file_list?.length >= 1 && (
              <ArticleButton text={'원문 보기'} onPress={handlePressPDF} />
            )}
          </View>,
        ]
      }
    />
  );
});
const SECITON__RELATED_ADDRESS = React.memo(() => {
  const state = useArticleDetailStoreState('RELATED_ADDRESS');

  const AddressList = React.memo(
    ({
      address_list,
    }: {
      address_list: DATA_Type['related_address']['address_list'];
    }) => {
      const [isCollapse, setIsCollapse] = useState<Boolean>(false);
      const toggleIsCollapse = () => setIsCollapse(!isCollapse);

      const LinkingToNaverMap = async () => {
        const deeplink = `nmap://search?appname=com.roadconstruct`;

        const isSupportedURL = await Linking.canOpenURL(deeplink);
        if (isSupportedURL) {
          await Linking.openURL(deeplink);
        } else {
          Linking.openURL(`https://m.map.naver.com`);
        }
      };

      const ST = StyleSheet.create({
        container: {},

        preview_container: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        viewmore_button: {
          backgroundColor: Color.BUTTONBACK,
          paddingHorizontal: 10,
          paddingVertical: 5,
        },
      });
      return (
        <>
          <View style={ST.container}>
            <View style={ST.preview_container}>
              <View style={{flex: 1}}>
                {address_list?.slice(0, 2)?.map((it, idx) => (
                  <View key={`ADDRESSTEXT_${idx}`} style={{marginBottom: 20}}>
                    <AddressText {...it} />
                  </View>
                ))}
                {isCollapse &&
                  address_list?.slice(2)?.map((it, idx) => (
                    <View key={`ADDRESSTEXT_${idx}`} style={{marginBottom: 20}}>
                      <AddressText {...it} />
                    </View>
                  ))}
              </View>
              <View>
                <ArticleButton
                  onPress={() => LinkingToNaverMap()}
                  text={'지도 보기'}
                />
                <View style={{marginBottom: 20}} />
                <ArticleButton
                  onPress={() =>
                    Linking.openURL('https://www.eum.go.kr/web/mp/mpMapDet.jsp')
                  }
                  text={'도면 보기'}
                />
              </View>
            </View>
            {address_list.length > 2 && (
              <TouchableOpacity
                onPress={() => toggleIsCollapse()}
                style={ST.viewmore_button}>
                <Typho
                  type={'CAPTION'}
                  text={isCollapse ? '닫기' : '더 보기'}
                  extraStyle={{textAlign: 'center'}}
                />
              </TouchableOpacity>
            )}
          </View>
        </>
      );
    },
  );
  const RenderImageItem = React.memo(({it}: {it: any}) => {
    return (
      <View>
        <Typho type={'LABEL'} text={it.title} />
        <ArticleImage img={it.url} />
      </View>
    );
  });
  const ImageList = React.memo(
    ({
      article_image_list,
    }: {
      article_image_list: DATA_Type['related_address']['article_image_list'];
    }) => {
      const [isCollapse, setIsCollapse] = useState<Boolean>(false);
      const toggleIsCollapse = () => setIsCollapse(!isCollapse);

      return (
        <>
          {article_image_list?.slice(0, 1)?.map((it, idx) => (
            <RenderImageItem
              key={`ARTICLE_RELATED_ADDRESS_IMAGE::${idx}`}
              it={it}
            />
          ))}
          {isCollapse && (
            <>
              {article_image_list?.slice(1)?.map((it, idx) => (
                <RenderImageItem
                  key={`ARTICLE_RELATED_ADDRESS_IMAGE::${idx}`}
                  it={it}
                />
              ))}
            </>
          )}
          {article_image_list?.length > 1 && (
            <TouchableOpacity
              onPress={() => toggleIsCollapse()}
              style={ST.viewmore_button}>
              <Typho
                type={'CAPTION'}
                text={isCollapse ? '닫기' : '더 보기'}
                extraStyle={{textAlign: 'center'}}
              />
            </TouchableOpacity>
          )}
        </>
      );
    },
  );
  return (
    <ArticleSection
      section_title={'관련 지번'}
      section_tooltip={
        <>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Typho
              type={'LABEL'}
              text={'도면보기: 먼저 관련지번을 눌러 복사해 주세요'}
              extraStyle={{color: Color.COMMON.PRIMARY}}
            />
          </View>
        </>
      }
      section_bodies={
        state && [
          <View key={1}>
            <AddressList address_list={state.address_list} />
          </View>,
          <View key={2}>
            <ImageList article_image_list={state.article_image_list} />
          </View>,
        ]
      }
    />
  );
});
const SECTION__ARTICLE_STEP = React.memo(() => {
  const state: DATA_Type['article_step'] = useArticleDetailStoreState(
    'ARTICLE_STEP',
  );
  return (
    <ArticleSection
      section_title={'진행 단계'}
      section_bodies={
        state && [
          <View key={`SECTION__STEP_1`}>
            {state.step_list.map((it, idx) => {
              return (
                <View key={`ITEM__STEP_${idx}`} style={{marginBottom: 5}}>
                  <View style={{flexDirection: 'row'}}>
                    <Typho
                      type={'H5'}
                      text={it}
                      extraStyle={[
                        idx == state.current_step_idx
                          ? {
                              color: '#C00003',
                              backgroundColor: '#E7E6E6',
                              paddingHorizontal: 7,
                              paddingVertical: 3,
                              borderRadius: 3,
                            }
                          : {color: 'black'},
                        {marginBottom: 5},
                      ]}
                    />
                  </View>

                  {idx !== state.step_list.length - 1 && (
                    <Icon_AntDesign name="down" style={{paddingLeft: 15}} />
                  )}
                </View>
              );
            })}
          </View>,
        ]
      }
    />
  );
});
const SECITON__RELREATED_CONTACT = React.memo(() => {
  const state: DATA_Type['related_contact'] = useArticleDetailStoreState(
    'RELATED_CONTACT',
  );

  const ST = StyleSheet.create({
    button_container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      backgroundColor: Color.THIRD,
      width: 100,
      paddingVertical: 8,
      borderRadius: 5,
    },
    button__text: {
      color: 'white',
      textAlign: 'center',
    },
  });
  const Item = ({
    source,
    contact,
  }: {
    source: string;
    contact: Array<{name: string; phone_num: string}>;
  }) => {
    return (
      <View>
        <Typho type={'LABEL'} text={source} />
        <View style={{marginBottom: 10}} />
        {contact?.map((it, idx) => (
          <View
            key={idx}
            style={{
              marginBottom: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Typho type={'H5'} text={it.name} extraStyle={{marginRight: 5}} />
              <Typho type={'H5'} text={`(${it.phone_num})`} />
            </View>
            <ArticleButton
              key={`CALL_${idx}`}
              text={'전화 걸기'}
              onPress={() => Linking.openURL(`tel:${it.phone_num}`)}
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <ArticleSection
      isFinal={true}
      section_title={'관련 문의'}
      section_bodies={[
        <View>
          {state &&
            state.map((it, idx) => (
              <Item
                key={`CONTACT::${idx}`}
                source={it.agency}
                contact={it.ministry_list}
              />
            ))}
        </View>,
      ]}></ArticleSection>
  );
});
const SECTION__USER_ACTION = React.memo(
  ({article_id}: {article_id: number}) => {
    const starred: DATA_Type['starred'] = useArticleDetailStoreState('STARRED');
    const viewShot = useArticleDetailViewShot();
    const width = Dimensions.get('window').width;
    const navigation = useNavigation();
    const loader = useLoader();
    const ST = StyleSheet.create({
      container: {
        backgroundColor: Color.DETAIL_SCENE.BOTTOM_TAB,
        bottom: 0,
        left: 0,
        right: 0,
        width: width,
        paddingVertical: 10,

        marginLeft: -10,
        marginBottom: -10,
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      itembox: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
      itemtext: {
        marginTop: 5,
        marginBottom: 5,
      },
    });

    const [localState, setLocalState] = useState<boolean>(starred);

    useEffect(() => {
      setLocalState(starred);
    }, [starred]);
    const action_starred = async () => {
      loader({type: 'SHOW_LOADER', text: '잠시만 기다려주세요'});
      const rest_data = await API_CALL(
        'put',
        'MAIN_HOST',
        'STAR',
        {article_id: article_id, flag: !localState},
        undefined,
        true,
      );
      loader({type: 'HIDE_LOADER'});
      if (rest_data) {
        if (rest_data.result === 'SUCCESS') {
          toastAlert(
            localState
              ? '내 관심에서 삭제하였습니다.'
              : '내 관심에 등록하였습니다',
          );
          setLocalState(!localState);
        } else {
          const msg = rest_data.msg;
          toastAlert(msg);
        }
      }
    };

    const action_shared = () => {
      viewShot(null);
    };

    const action_news = () => {
      navigation.navigate(GlobalEnum.Route.ARTICLE_NEWS, {
        article_id: article_id,
      });
    };

    return (
      <View style={ST.container}>
        <TouchableOpacity onPress={() => action_starred()} style={ST.itembox}>
          <CustomIcon type={localState ? 'BLUE_STAR' : 'STAR'} />
          <Typho type={'LABEL'} text={'내 관심'} extraStyle={ST.itemtext} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => action_shared()} style={ST.itembox}>
          <CustomIcon type={'SHARE'} />
          <Typho type={'LABEL'} text={'공유하기'} extraStyle={ST.itemtext} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => action_news()} style={ST.itembox}>
          <CustomIcon type={'DOCUMENT'} />
          <Typho type={'LABEL'} text={'관련기사'} extraStyle={ST.itemtext} />
        </TouchableOpacity>
      </View>
    );
  },
);
////////////////////////////////////////////////////
//  SCENE
////////////////////////////////////////////////////
type Props = {
  route?: any;
  navigation?: any;
};
const ArticleDetailScene = (props: Props) => {
  const article_id = props.route?.params?.article_id;
  return (
    <ArticleDetailProvider article_id={article_id}>
      <>
        <SceneLayout isScrollAble={true}>
          <ViewShotProvider>
            <View style={ST.container}>
              <View style={ST.section_list}>
                <SECITON__TOPIC_CONTENT />
                <SECITON__RELATED_ADDRESS />
                <SECTION__ARTICLE_STEP />
                <SECITON__RELREATED_CONTACT />
              </View>
              <SECTION__USER_ACTION article_id={article_id} />
            </View>
          </ViewShotProvider>
        </SceneLayout>
      </>
    </ArticleDetailProvider>
  );
};

const ST = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  section_list: {
    flex: 1,
  },

  section_wrapper: {
    // backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: Color.COMMON.BORDER,
  },
  section_header_wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section_header: {
    backgroundColor: Color.COMMON.PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    marginBottom: 20,
  },
  section_header__text: {
    color: 'white',
  },
  section_body_item: {
    marginBottom: 20,
  },
  viewmore_button: {
    backgroundColor: Color.BUTTONBACK,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default ArticleDetailScene;
