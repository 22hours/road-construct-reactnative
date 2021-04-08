import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
} from 'react-native';

// LAYOUT
import SceneLayout from '~/layout/SceneLayout';

// ICONS
import Icon_FontAwesome from 'react-native-vector-icons/FontAwesome';

type Select = '지자체' | '정부' | '언론' | '내 관심' | '지도보기';

type Props = {
  state: Select;
};

const ArticleSearchBar = React.memo(({state}: Props) => {
  const [search, setSearch] = useState<string>('');
  useEffect(() => {
    setSearch('');
  }, [state]);
  return (
    <View style={ST.container}>
      <TextInput
        style={ST.textinput}
        placeholder="검색어를 입력하세요"
        value={search}
        onChangeText={value => setSearch(value)}
      />
      <Icon_FontAwesome name="search" style={ST.icon} />
    </View>
  );
});

const ST = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(245,245,245)',
    elevation: 11,
    borderRadius: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textinput: {
    fontFamily: 'AppleSDGothicNeoB',
    flex: 1,
  },
  icon: {
    color: 'gray',
  },
});

export default ArticleSearchBar;
