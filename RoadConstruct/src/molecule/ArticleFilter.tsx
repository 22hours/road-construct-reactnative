import React, {useEffect, useReducer, useCallback, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  Appearance,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

// GLOBAL STORE
import {useLocationData} from '~/store/AppGlobalStore';

// LAYOUT
import Typho from '~/Typho';

// ICONS
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
    const pickerRef = useRef<RNPickerSelect | null>(null);
    const pressPickerArea = () => {
      if (pickerRef.current) {
        pickerRef.current.togglePicker();
      }
    };

    const ps = StyleSheet.create({
      inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
      },
      inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
      },
    });
    const colorScheme = Appearance.getColorScheme();
    const textcolor = colorScheme === 'dark' ? 'white' : 'black';

    return (
      <TouchableNativeFeedback onPress={() => pressPickerArea()}>
        <View style={ST.picker}>
          <RNPickerSelect
            ref={r => (pickerRef.current = r)}
            useNativeAndroidPickerStyle={false}
            placeholder={{label: '검색대상 도시를 선택하세요', value: null}}
            onValueChange={value => handleChange(value)}
            value={nowSelect}
            style={{
              inputAndroidContainer: {padding: 10},
              chevron: {backgroundColor: 'black '},
              viewContainer: {backgroundColor: 'red'},
            }}
            items={
              items
                ? items?.map(it => {
                    return {label: it, value: it, color: textcolor};
                  })
                : []
            }>
            <Typho type={'H5'} text={nowSelect} />
          </RNPickerSelect>
        </View>
      </TouchableNativeFeedback>
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
    if (nowSi === '전체') return ['전체'];
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
        <LocationPicker
          nowSelect={state.si}
          items={['전체'].concat(locationState.si_list)}
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
    // padding: 10,
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
