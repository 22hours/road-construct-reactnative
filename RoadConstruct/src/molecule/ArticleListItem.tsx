import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';

import Typho from '~/Typho';
import Color from '~/Color';
import {api_types} from '@global_types';
import {useNavigation} from '@react-navigation/native';
import GlobalEnum from '~/GlobalEnum';

type ItemProps = api_types.article_list_item;

// const SekeltonItem = React.memo(() => {
//   return (
//     <SkeletonPlaceholder>
//       <View style={[ST.container, {elevation: 0}]}></View>
//     </SkeletonPlaceholder>
//   );
// });
const ArticleListItem = React.memo((props: ItemProps) => {
  const navigation = useNavigation();

  var date = new Date(props.date);

  var res_date = `${date.getFullYear()}.${
    date.getMonth() + 1
  }.${date.getDate()}`;

  return (
    <View style={ST.container}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(GlobalEnum.Route.ARTICLE_DETAIL, {
            article_id: props.article_id,
          })
        }>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Typho type={'H4'} text={props.title} />
          <Typho
            type={'LABEL'}
            text={`\( ${res_date?.toString()}\ )`}
            extraStyle={ST.dateBox}
          />
        </View>
        <Typho type={'H5'} text={props.summary} extraStyle={{marginTop: 10}} />
      </TouchableOpacity>
    </View>
  );
});

const ST = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 15,

    borderBottomColor: Color.LIST_SCENE.BORDER,
    borderBottomWidth: 1,
  },
  steppannel_top: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Color.SECONDARY,
    marginBottom: 5,
    borderRadius: 1,
  },
  steppannel_bottom: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: Color.THIRD,
    borderRadius: 1,
  },
  dateBox: {
    color: 'white',
    backgroundColor: Color.COMMON.PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginLeft: 10,
    borderRadius: 5,
  },
});

export default ArticleListItem;
