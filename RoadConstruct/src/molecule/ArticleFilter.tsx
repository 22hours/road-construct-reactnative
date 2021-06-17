import React, {useEffect, useReducer, useCallback, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Appearance,
  Text,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import Modal from 'react-native-modal';

// GLOBAL STORE
import {useLocationData} from '~/store/AppGlobalStore';

// LAYOUT
import Typho from '~/Typho';

// ICONS
import Icon_AntDesign from 'react-native-vector-icons/AntDesign';
import Color from '~/Color';
import {
  useArticleListStoreDispatch,
  useArticleListStoreState,
} from '~/store/ArticleListStore';
import {useToggleBoolean} from '~/Hooks';
import {ScrollView} from 'react-native-gesture-handler';

const SelectModal = ({itemList, isVisible, toggleModal, handleChange}) => {
  return (
    <Modal isVisible={isVisible}>
      <TouchableOpacity
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
        onPress={() => toggleModal()}>
        <TouchableOpacity activeOpacity={1} style={{padding: 10}}>
          <View style={LST.modal_container}>
            <View style={LST.modal_header}>
              <Typho
                type={'LABEL'}
                text={'지역을 선택하세요'}
                extraStyle={LST.modal_header_text}
              />
              <TouchableOpacity
                style={LST.close_icon_wrapper}
                onPress={() => toggleModal()}>
                <Icon_AntDesign name="close" style={LST.close_icon} />
              </TouchableOpacity>
            </View>

            <ScrollView style={LST.modal_item_list}>
              {itemList.map((it, idx) => (
                <TouchableOpacity
                  key={`MODAL_ITEM::${idx}`}
                  onPress={() => handleChange(it)}
                  style={LST.modal_item}>
                  <Typho type={'H5'} text={it} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const LocationSelect = ({
  items,
  nowSelect,
  handleChange,
}: {
  items: any;
  nowSelect: string;
  handleChange: (data: string) => void;
}) => {
  const {state, toggle, setState} = useToggleBoolean();
  const handleLocalChange = (value: string) => {
    setState(false);
    handleChange(value);
  };
  return (
    <>
      <TouchableOpacity style={LST.select_container} onPress={() => toggle()}>
        <Typho type={'H5'} text={nowSelect} />
        <Icon_AntDesign name="caretdown" style={LST.icon} />
      </TouchableOpacity>
      <SelectModal
        isVisible={state}
        toggleModal={toggle}
        itemList={items}
        handleChange={handleLocalChange}
      />
    </>
  );
};

const LST = StyleSheet.create({
  select_container: {
    backgroundColor: Color.LIST_SCENE.FILTER_BACK,
    minWidth: 120,
    flex: 1,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    color: 'gray',
  },
  modal_container: {
    minWidth: 300,
    flex: 1,
    backgroundColor: 'white',
    // paddingVertical: 20,
  },
  modal_header: {
    backgroundColor: 'white',
    borderBottomColor: 'rgb(230,230,230)',
    borderBottomWidth: 1,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modal_header_text: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: 'gray',
  },
  close_icon_wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  close_icon: {
    fontSize: 20,
  },
  modal_item_list: {
    marginTop: 5,
  },
  modal_item: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(240,240,240)',
  },
});

type State = {si: string; gu: string; selectable_gu_list: Array<string>};
type Action =
  | {type: 'SET_SI'; data: string}
  | {type: 'SET_GU'; data: string}
  | {type: 'INIT_GU'; data: string};

const ArticleFilter = () => {
  const pageFilterState = useArticleListStoreState('FILTER');
  const dispatchStoreFilter = useArticleListStoreDispatch();
  const locationState = useLocationData();

  const getGuList = nowSi => {
    var matchIdx = locationState.origin_data.findIndex(it => it.si === nowSi);
    if (nowSi === '전국') return ['전체'];
    if (matchIdx === -1) throw new Error('GU LIST ERROR :: IN ARTICLE FILTER');
    else {
      var res_gu_list: Array<string> = ['전체'];

      var origin_gu_list: Array<string> = locationState.origin_data[
        matchIdx
      ]?.gu_list?.slice();

      res_gu_list = res_gu_list.concat(origin_gu_list);
      return res_gu_list;
    }
  };

  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'SET_SI':
        var gu_list = getGuList(action.data);
        return {
          si: action.data,
          gu: '전체',
          selectable_gu_list: gu_list,
        };
      case 'SET_GU':
        return {
          ...state,
          gu: action.data,
        };

      default:
        throw new Error('ARTICLE FILTER ERROR!');
    }
  };

  const [state, dispatch] = useReducer(reducer, {
    si: '',
    gu: '',
    selectable_gu_list: [],
  });

  useEffect(() => {
    dispatch({type: 'SET_SI', data: pageFilterState.filter.si});
  }, []);

  const setSi = useCallback(data => {
    if (data !== null) {
      dispatch({type: 'SET_SI', data: data});
    }
  }, []);
  const setGu = useCallback(data => {
    if (data !== null) {
      dispatch({type: 'SET_GU', data: data});
    }
  }, []);

  return (
    <View style={ST.container}>
      <View style={ST.left_box}>
        <LocationSelect
          nowSelect={state.si}
          items={['전국'].concat(locationState.si_list)}
          handleChange={setSi}
        />
        <LocationSelect
          nowSelect={state.gu}
          items={state.selectable_gu_list}
          handleChange={setGu}
        />
      </View>
      <TouchableOpacity
        onPress={() =>
          dispatchStoreFilter({
            type: 'SET_FILTER',
            data: {si: state.si, gu: state.gu},
          })
        }
        style={ST.right_box}>
        <Typho
          type={'H5'}
          text={'검색'}
          extraStyle={{textAlign: 'center', fontFamily: 'AppleSDGothicNeoEB'}}
        />
      </TouchableOpacity>
    </View>
  );
};

const ST = StyleSheet.create({
  container: {
    // backgroundColor: 'rgb(245,245,245)',
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left_box: {
    flexGrow: 1,
    flex: 1,
    flexDirection: 'row',
  },
  picker: {
    backgroundColor: Color.LIST_SCENE.FILTER_BACK,
    minWidth: 120,
    borderRadius: 5,
    marginRight: 10,
  },
  right_box: {
    width: 60,
    padding: 10,
    borderRadius: 5,
    backgroundColor: Color.LIST_SCENE.TAB_ON,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: 'gray',
  },
});

export default ArticleFilter;
