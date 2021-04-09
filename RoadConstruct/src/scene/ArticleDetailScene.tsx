import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

// STORE
import {
  ArticleDetailProvider,
  ArticleDetailContext,
} from '~/store/ArticleDetailStore';

// ENUM
import GlobalEnum from '~/GlobalEnum';

// LAYOUT
import SceneLayout from '~/layout/SceneLayout';

//TEST
import {TouchableOpacity} from 'react-native-gesture-handler';
import Color from '~/Color';
import Typho from '~/Typho';

// ATOMS
import ArticleButton from '~/atom/ArticleButton';
import AddressText from '~/molecule/AddressText';
import ArticleImage from '~/atom/ArticleImage';

type Props = {};

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
const Article_MainContent = React.memo(() => {
  const {dispatch} = useContext(ArticleDetailContext);
  return (
    <ArticleSection
      section_title={'주요 내용'}
      section_bodies={[
        <View key={1}>
          <Typho
            type={'H5'}
            text={
              '와부읍 팔당리 649-3번지 일원에 도로 (소로2-266호선) 결정(안)에 대한 주민 의견 청취  '
            }
          />
        </View>,
        <View key={2}>
          <ArticleButton
            text={'원문 보기'}
            icon={'원문 보기'}
            onPress={() => {
              console.log('HAHAHAH');
              dispatch({type: 'PDF'});
            }}
          />
        </View>,
      ]}
    />
  );
});
const Article_Releated = React.memo(() => {
  const [isCollapse, setIsCollapse] = useState<Boolean>(false);
  const toggleIsCollapse = () => setIsCollapse(!isCollapse);

  const address_list = [
    {
      label: '시점',
      value: '서울특별시 강서구 공항대로 65길 32 ~~롯데캐슬 102동 302호',
    },
    {label: '중점', value: '봉담읍 동화리 와우리'},
    {label: '종점', value: '서울 마포구 홍대'},
    {label: '종점', value: '서울 마포구 홍대'},
    {label: '종점', value: '서울 마포구 홍대1'},
    {label: '종점', value: '서울 마포구 홍대2'},
  ];
  const AddressList = React.memo(() => {
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
            {address_list?.slice(0, 3)?.map((it, idx) => (
              <View key={`ADDRESSTEXT_${idx}`} style={{marginBottom: 20}}>
                <AddressText {...it} />
              </View>
            ))}
            {isCollapse &&
              address_list?.slice(4)?.map((it, idx) => (
                <View key={`ADDRESSTEXT_${idx}`} style={{marginBottom: 20}}>
                  <AddressText {...it} />
                </View>
              ))}
          </View>
          <View>
            <ArticleButton text={'지도 보기'} icon={'지도 보기'} />
            <View style={{marginBottom: 20}} />
            <ArticleButton text={'도면 보기'} icon={'도면 보기'} />
          </View>
        </View>
        {address_list.length > 3 && (
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
  });
  const ImageList = React.memo(() => {
    return (
      <ArticleImage
        img={
          'https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F0f83d5ba-2acd-48b3-a8dd-2d37ac7e7a81%2FKakaoTalk_20210407_172051674.jpg?table=block&id=16e1c2d2-e183-4f89-a1b6-26d092721665&width=3410&userId=8336b9b0-8e8c-481a-b0ee-42d661f8479f&cache=v2'
        }
      />
    );
  });
  return (
    <ArticleSection
      section_title={'관련 지번'}
      section_bodies={[
        <View key={1}>
          <AddressList />
        </View>,
        <View key={2}>
          <ImageList />
        </View>,
      ]}
    />
  );
});
const Article_PastRelated = React.memo(() => {
  const Item = ({label, value}) => {
    return (
      <View>
        <Typho type={'LABEL'} text={label} />
        <Typho type={'H5'} text={value} />
      </View>
    );
  };
  return (
    <ArticleSection
      section_title={'과거 관련 공시'}
      section_bodies={[
        <Item label={'고시일'} value={'2020.03.03'} />,
        <Item
          label={'고시 제목'}
          value={'도시관리 계획(도로:소로2-266) 결정(안) 입안 결정'}
        />,
        <Item
          label={'내용 보기'}
          value={'도시관리 계획(도로:소로2-266) 결정(안) 입안 결정'}
        />,
      ]}></ArticleSection>
  );
});
const Article_Contact = React.memo(() => {
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
    contact: Array<{label: string; value: string}>;
  }) => {
    return (
      <View>
        <Typho type={'LABEL'} text={source} />
        <View style={{marginBottom: 10}} />
        {contact.map((it, idx) => (
          <View key={idx} style={{marginBottom: 20}}>
            <ArticleButton
              key={`CALL_${idx}`}
              text={it.label}
              icon={'전화 걸기'}
              isExpand={true}
              expandText={'전화 걸기'}
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
          <Item
            source={'남양주 시청'}
            contact={[
              {label: '도시정책과 (031-590-8321)', value: '031-590-8321'},
              {label: '도시정책과 (031-590-832221)', value: '031-590-8321'},
            ]}
          />
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

const ArticleDetailScene = (props: Props) => {
  return (
    <ArticleDetailProvider article_id={1}>
      <SceneLayout isScrollAble={true}>
        <Article_MainContent />
        <Article_Releated />
        <Article_PastRelated />
        <Article_Contact />
      </SceneLayout>
    </ArticleDetailProvider>
  );
};

const ST = StyleSheet.create({
  section_wrapper: {
    backgroundColor: 'white',
    elevation: 11,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  section_header_wrapper: {
    flexDirection: 'row',
  },
  section_header: {
    backgroundColor: Color.PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    elevation: 11,
    marginBottom: 20,
  },
  section_header__text: {
    color: 'white',
  },
  section_body_item: {
    marginBottom: 20,
  },
});

export default ArticleDetailScene;
