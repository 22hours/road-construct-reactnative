import React, {useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// STORE
import {useLocationData} from '~/store/AppGlobalStore';

// LAYOUT
import SceneLayout from '~/layout/SceneLayout';
import GlobalEnum from '~/GlobalEnum';
import Typho from '~/Typho';
import Color from '~/Color';
import CustomIcon from '~/atom/CustomIcon';
import {API_CALL} from '~/api';
import {toastAlert} from '~/util';
type Props = {};

const SiBox = ({si, isNew, onPress}) => {
  const newTextStyle = isNew
    ? {color: Color.MAIN_SCENE.NEW_TEXT}
    : {color: Color.MAIN_SCENE.ITEM_BACK};
  return (
    <TouchableOpacity onPress={() => onPress(si)} style={ST.sibox_container}>
      <Typho
        type={'SECTION_HEADER'}
        text={'NEW'}
        extraStyle={[ST.sibox_new_text, newTextStyle]}
      />
      <Typho type={'H5'} text={si} extraStyle={ST.sibox_si_text} />
    </TouchableOpacity>
  );
};

const MainScene = () => {
  const navigation = useNavigation();
  const locationData = useLocationData();
  const [newList, setNewList] = useState<Array<string>>([]);
  const getNewList = async () => {
    const rest_data = await API_CALL('get', 'MAIN_HOST', 'NEW_SI_LIST');
    if (rest_data) {
      if (rest_data.result === 'SUCCESS') {
        setNewList(rest_data.data);
      } else {
        toastAlert('새로운 정보를 받아오는데 문제가 발생하였습니다');
      }
    }
  };
  useEffect(() => {
    getNewList();
  }, []);

  const handleClickItem = si => {
    navigation.navigate(GlobalEnum.Route.ARTICLE_LIST, {initSi: si});
  };

  return (
    <SceneLayout>
      <View style={ST.container}>
        <View style={ST.header}>
          <Typho
            type={'H4'}
            text={'지역 선택'}
            extraStyle={{marginRight: 10}}
          />
          <CustomIcon type={'CHECK'} width={17} height={17} />
        </View>
        <ScrollView>
          <View style={ST.body}>
            {locationData?.si_list?.map(it => {
              var isNew = false;
              if (newList) {
                isNew = newList?.indexOf(it) === -1 ? false : true;
              }
              return (
                <SiBox
                  isNew={isNew}
                  key={it}
                  si={it}
                  onPress={handleClickItem}
                />
              );
            })}
          </View>
        </ScrollView>

        <View style={ST.footer}>
          <Typho
            type={'CAPTION'}
            text={
              '도로 신설 소식의 모든 정보는 지자체, 정부기관 및 언론사에서 공개한 정보를 기반으로 제공됨을 알려 드립니다.'
            }
          />
        </View>
      </View>
    </SceneLayout>
  );
};

const ST = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
    paddingHorizontal: 5,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sibox_container: {
    width: '30%',
    marginHorizontal: '1.5%',
    backgroundColor: Color.MAIN_SCENE.ITEM_BACK,
    borderRadius: 5,
    height: 60,

    paddingVertical: 5,
    paddingHorizontal: 20,
    marginBottom: 15,

    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sibox_new_text: {
    fontSize: 8,
    fontFamily: 'CooperBlack',
  },
  sibox_si_text: {
    color: 'black',
  },
  footer: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  footer_text: {},
});

export default MainScene;
