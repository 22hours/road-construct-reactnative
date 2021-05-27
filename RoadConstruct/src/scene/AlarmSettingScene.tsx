import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Switch,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
  Dimensions,
  LayoutAnimation,
  UIManager,
  ActivityIndicator,
} from 'react-native';
import Color from '~/Color';

// ICONS
import Icon_Entypo from 'react-native-vector-icons/Entypo'; //squared-plus // squared-minus
import Icon_AntDesign from 'react-native-vector-icons/AntDesign';
// pluscircle
// closecircle

// LAYOUT
import SceneLayout from '~/layout/SceneLayout';
import {
  AlarmSettingProvider,
  useAlarmSettingDispatch,
  useAlarmSettingState,
} from '~/store/AlarmSettingStore';
import Typho from '~/Typho';

////////////////////////////////////////////////////
//  GU
////////////////////////////////////////////////////
type guProps = {
  si: string;
  gu: string;
  alarmed?: boolean;
};
function guItemPropsAreEqual(prevProps, nextProps) {
  return prevProps.alarmed === nextProps.alarmed;
}

const GuItem = React.memo(({si, gu, alarmed}: guProps) => {
  const [isAlarmed, setIsAlarmed] = useState(alarmed);

  const dispatch = useAlarmSettingDispatch();
  const handleToggleGu = () => {
    dispatch({
      type: alarmed ? 'REMOVE_GU' : 'ADD_GU',
      data: {target_si: si, target_gu: gu},
    });
    setIsAlarmed(!isAlarmed);
  };

  useEffect(() => {
    setIsAlarmed(alarmed);
  }, [alarmed]);
  return (
    <TouchableOpacity
      style={[
        GU_ST.containter,
        isAlarmed ? GU_ST.container_on : GU_ST.container_off,
      ]}
      onPress={() => handleToggleGu()}>
      <Typho
        type={'LABEL'}
        text={gu}
        extraStyle={[
          GU_ST.text,
          isAlarmed ? GU_ST.on : GU_ST.off,
          {marginRight: 15},
        ]}
      />
      <Icon_AntDesign
        style={[GU_ST.text, isAlarmed ? GU_ST.on : GU_ST.off]}
        name={`${isAlarmed ? 'close' : 'plus'}circle`}
      />
    </TouchableOpacity>
  );
}, guItemPropsAreEqual);

const GU_ST = StyleSheet.create({
  containter: {
    paddingHorizontal: 7,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 3,
    marginVertical: 7,
  },
  container_on: {
    backgroundColor: Color.COMMON.PRIMARY,
  },
  container_off: {
    backgroundColor: '#A2A2A2',
  },
  text: {
    fontSize: 13,
  },
  on: {
    color: 'white',
  },
  off: {
    color: 'white',
  },
});

////////////////////////////////////////////////////
//  SI
////////////////////////////////////////////////////
type siProps = {
  isAllAlaremd: boolean;
  si: string;
  gu_list: Array<{gu: string; alarmed?: boolean}>;
};
const SiItem = ({si, gu_list, isAllAlaremd}: siProps) => {
  const [isExpand, setIsExpand] = useState(false);
  const dispatch = useAlarmSettingDispatch();
  const handleToggleSi = () => {
    dispatch({
      type: isAllAlaremd ? 'REMOVE_SI' : 'ADD_SI',
      data: {
        target_si: si,
        isAllAlaremd: isAllAlaremd,
      },
    });
  };

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpand(!isExpand);
  };
  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);
  return (
    <View style={SI_ST.container}>
      <View style={SI_ST.header_container}>
        <TouchableNativeFeedback onPress={() => toggleExpand()}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              padding: 10,
              paddingVertical: 15,
              alignItems: 'center',
            }}>
            <Icon_Entypo
              style={[
                {marginRight: 10, fontSize: 15},
                isExpand
                  ? {color: Color.COMMON.PRIMARY}
                  : {color: Color.COMMON.BORDER},
              ]}
              name={`squared-${isExpand ? 'minus' : 'plus'}`}
            />
            <Typho type={'H4'} text={si} extraStyle={{color: 'black'}} />
          </View>
        </TouchableNativeFeedback>

        <Switch
          style={SI_ST.switch}
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isAllAlaremd ? Color.COMMON.PRIMARY : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleToggleSi}
          value={isAllAlaremd}
        />
      </View>

      <View style={{height: isExpand ? null : 0, overflow: 'hidden'}}>
        <View style={SI_ST.gu_list_container}>
          {gu_list.length >= 1 &&
            gu_list.map((it, idx) => {
              return (
                <GuItem
                  key={`GU_BOX::${idx}`}
                  si={si}
                  gu={it.gu}
                  alarmed={isAllAlaremd ? true : it.alarmed}
                />
              );
            })}
        </View>
      </View>
    </View>
  );
};

const SI_ST = StyleSheet.create({
  container: {
    borderColor: Color.COMMON.BORDER,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  header_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 11,
  },
  switch: {
    paddingLeft: 20,
  },
  gu_list_container: {
    marginTop: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 10,
  },
});

////////////////////////////////////////////////////
//  PARENT
////////////////////////////////////////////////////
const screenWidth = Dimensions.get('window').width;
const AlarmSettingController = () => {
  const {state, isLoad, submitAction} = useAlarmSettingState();
  return (
    <>
      <SceneLayout isScrollAble={true}>
        <>
          {state.length >= 1 &&
            state.map((first_elm, idx) => {
              var cur_gu_list = first_elm.gu_list;
              var isAllAlaremd =
                cur_gu_list.findIndex(it => !it.alarmed) === -1 ? true : false;
              return (
                <SiItem
                  key={`SI_BOX::${idx}`}
                  {...first_elm}
                  isAllAlaremd={isAllAlaremd}
                />
              );
            })}
        </>
      </SceneLayout>

      <TouchableNativeFeedback
        style={P_ST.button_container}
        onPress={!isLoad ? () => submitAction() : () => {}}>
        <View style={[P_ST.button, isLoad ? {} : {}]}>
          {!isLoad ? (
            <Typho
              type={'H4'}
              text={'설정 완료'}
              extraStyle={P_ST.button_text}
            />
          ) : (
            <ActivityIndicator size="large" color="white" />
          )}
        </View>
      </TouchableNativeFeedback>
    </>
  );
};

const P_ST = StyleSheet.create({
  button_container: {
    position: 'absolute',
    bottom: 0,
    width: screenWidth,
    backgroundColor: 'white',
  },
  button: {
    margin: 10,
    backgroundColor: Color.COMMON.PRIMARY,
    paddingVertical: 10,
    borderRadius: 5,
    height: 45,
  },
  button_text: {
    color: 'white',
    textAlign: 'center',
  },
});

////////////////////////////////////////////////////
//  PARENT'S WRAPPER
////////////////////////////////////////////////////
const AlarmSettingScene = () => {
  return (
    <AlarmSettingProvider>
      <AlarmSettingController />
    </AlarmSettingProvider>
  );
};

export default AlarmSettingScene;
