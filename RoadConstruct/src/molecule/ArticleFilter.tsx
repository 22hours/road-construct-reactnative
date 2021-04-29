import React, {useState, useEffect, useReducer, useCallback} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {meta_types} from '@global_types';

// GLOBAL STORE
import {useLocationData} from '~/store/AppGlobalStore';

// LAYOUT
import Typho from '~/Typho';

// ICONS
import Icon_FontAwesome from 'react-native-vector-icons/FontAwesome';
import Color from '~/Color';
import {
  useArticleListStoreDispatch,
  useArticleListStoreState,
} from '~/store/ArticleListStore';

const LocationPicker = React.memo(
  ({
    items,
    nowSelect,
    handleChange,
  }: {
    items: any;
    nowSelect: string;
    handleChange: (data: string) => void;
  }) => {
    return (
      <View style={ST.picker}>
        <RNPickerSelect
          useNativeAndroidPickerStyle={false}
          placeholder={{label: '검색대상 도시를 선택하세요', value: null}}
          onValueChange={value => handleChange(value)}
          items={
            items
              ? items?.map(it => {
                  return {label: it, value: it};
                })
              : []
          }>
          <Typho type={'H5'} text={nowSelect} />
        </RNPickerSelect>
      </View>
    );
  },
);

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
    if (matchIdx === -1) throw new Error('GU LIST ERROR :: IN ARTICLE FILTER');
    else {
      return locationState.origin_data[matchIdx].gus;
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
        <LocationPicker
          nowSelect={state.si}
          items={locationState.si_list}
          handleChange={setSi}
        />
        <LocationPicker
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
        <Typho type={'H5'} text={'검색'} extraStyle={{textAlign: 'center'}} />
      </TouchableOpacity>
    </View>
  );
};

const ST = StyleSheet.create({
  container: {
    // backgroundColor: 'rgb(245,245,245)',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left_box: {
    flex: 1,
    flexDirection: 'row',
  },
  picker: {
    backgroundColor: Color.LIST_SCENE.FILTER_BACK,
    minWidth: 150,
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  right_box: {
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: Color.LIST_SCENE.FILTER_BACK,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: 'gray',
  },
});

export default ArticleFilter;
