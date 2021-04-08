import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
} from 'react-native';
import Color from '~/Color';
import Typho from '~/Typho';

// Icons
import Icon_Ionicons from 'react-native-vector-icons/Ionicons';
import Icon_MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon_FontAwesome from 'react-native-vector-icons/FontAwesome';

type Props = {
  text: string;
  icon: string;
  isExpand?: Boolean;
  expandText?: string;
  onPress: () => void;
};

const RenderIcon = ({icon}) => {
  switch (icon) {
    case '원문 보기':
      return (
        <Icon_Ionicons
          name="document-attach-outline"
          style={ST.section_button_icon}
        />
      );
    case '지도 보기':
      return (
        <Icon_MaterialCommunityIcons
          name="map-marker-radius"
          style={ST.section_button_icon}
        />
      );
    case '도면 보기':
      return <Icon_FontAwesome name="search" style={ST.section_button_icon} />;
    case '전화 걸기':
      return <Icon_Ionicons name="call" style={ST.section_button_icon} />;

    default:
      return <></>;
  }
};

const RenderIconBody = ({text, icon, isExpand, expandText, onPress}: Props) => {
  return (
    <TouchableOpacity onPress={() => onPress()} style={ST.section_button}>
      <View style={ST.section_button__left}>
        <Typho
          type={'LABEL'}
          text={text}
          extraStyle={ST.section_button__text}
        />
        {isExpand && (
          <Typho
            type={'LABEL'}
            text={expandText}
            extraStyle={ST.section_button__text}
          />
        )}
      </View>

      <View style={ST.section_button__right}>
        <RenderIcon icon={icon} />
      </View>
    </TouchableOpacity>
  );
};

const ArticleButton = (props: Props) => {
  const {text, icon, isExpand, expandText} = props;
  if (isExpand) {
    return <RenderIconBody {...props} />;
  } else {
    return (
      <Text>
        <RenderIconBody {...props} />
      </Text>
    );
  }
};

const ST = StyleSheet.create({
  // SECTION BUTTON STYLE
  section_button: {
    flexDirection: 'row',
    backgroundColor: Color.BUTTONBACK,
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderRadius: 5,
  },
  section_button__left: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section_button__text: {
    color: Color.SECONDARY,
  },
  section_button__right: {
    backgroundColor: Color.SECONDARY,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  section_button_icon: {
    color: 'white',
    fontSize: 15,
  },
});

export default ArticleButton;
