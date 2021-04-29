import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  Linking,
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

// ORGANISM
import ViewShotArea from '~/organism/ViewShotArea';

// ATOMS
import ArticleButton from '~/atom/ArticleButton';
import AddressText from '~/molecule/AddressText';
import ArticleImage from '~/atom/ArticleImage';
import {toastAlert} from '~/util';
import {useNavigation} from '@react-navigation/native';

// ICONS
import Icon_AntDesign from 'react-native-vector-icons/AntDesign';

type DATA_Type = api_types.api_response__article_detail;

////////////////////////////////////////////////////
//  COMMON
////////////////////////////////////////////////////
const ArticleSection = ({
  section_title,
  section_bodies,
}: {
  section_title: string;
  section_bodies: Array<JSX.Element>;
}) => {
  return (
    <View style={ST.section_wrapper}>
      <View style={ST.section_header_wrapper}>
        <Text style={ST.section_header}>
          <Typho
            type={'SECTION_HEADER'}
            text={section_title}
            extraStyle={ST.section_header__text}
          />
        </Text>
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

  const handlePressPDF = useCallback(() => {
    var origin_pdf_file_url = state.article_file_list[0].url;
    navigation.navigate(GlobalEnum.Route.PDF_SCENE, {
      pdf_uri: origin_pdf_file_url,
    });
  }, []);
  return (
    <ArticleSection
      section_title={'주요 내용'}
      section_bodies={
        state && [
          <View key={1} style={{flexDirection: 'row'}}>
            <Typho
              type={'H5'}
              text={state.content}
              extraStyle={{color: 'black'}}
            />
            {state.article_file_list?.length >= 1 && (
              <ArticleButton
                text={'원문 보기'}
                icon={'원문 보기'}
                onPress={handlePressPDF}
              />
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
                onPress={() => Linking.openURL('https://www.nav')}
                text={'지도 보기'}
                icon={'지도 보기'}
              />
              <View style={{marginBottom: 20}} />
              <ArticleButton
                onPress={() => toastAlert('TODO')}
                text={'도면 보기'}
                icon={'도면 보기'}
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
      );
    },
  );
  const RenderImageItem = React.memo(({it}: {it: any}) => {
    useEffect(() => {
      console.log('IMAGE');
    });
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
      useEffect(() => {
        console.log('RENDER IMAGE');
      });

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
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                              borderRadius: 3,
                            }
                          : {color: 'black'},
                        {marginBottom: 5},
                      ]}
                    />
                  </View>

                  {idx !== state.step_list.length - 1 && (
                    <Icon_AntDesign name="down" style={{paddingLeft: 10}} />
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
    console.log(contact);
    return (
      <View>
        <Typho type={'LABEL'} text={source} />
        <View style={{marginBottom: 10}} />
        {contact?.map((it, idx) => (
          <View key={idx} style={{marginBottom: 20}}>
            <ArticleButton
              key={`CALL_${idx}`}
              text={it.name}
              icon={'전화 걸기'}
              isExpand={true}
              expandText={'전화 걸기'}
              onPress={() => Linking.openURL(`tel:${it.phone_num}`)}
            />
          </View>
        ))}
      </View>
    );
  };
  const Button = ({text, onPress}) => {
    return (
      <TouchableOpacity style={ST.button} onPress={() => onPress()}>
        <Typho type={'LABEL'} text={text} extraStyle={ST.button__text} />
      </TouchableOpacity>
    );
  };

  return (
    <ArticleSection
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
        <View style={ST.button_container}>
          <Button text={'공유'} onPress={() => {}} />
          <Button text={'내 관심'} onPress={() => {}} />
          <Button text={'관련 기사'} onPress={() => {}} />
        </View>,
      ]}></ArticleSection>
  );
});

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
      <SceneLayout isScrollAble={true}>
        <ViewShotArea navigation={props.navigation}>
          <>
            <SECITON__TOPIC_CONTENT />
            <SECITON__RELATED_ADDRESS />
            <SECTION__ARTICLE_STEP />
            <SECITON__RELREATED_CONTACT />
            {/* <Article_Releated />
            <Article_PastRelated />
            <Article_Contact /> */}
          </>
        </ViewShotArea>
      </SceneLayout>
    </ArticleDetailProvider>
  );
};

const ST = StyleSheet.create({
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
