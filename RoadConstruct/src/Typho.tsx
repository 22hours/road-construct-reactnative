import React from 'react';
import {Text, StyleSheet, TextStyle} from 'react-native';

type TyphoDetailProps = {
  text?: string;
  style?: any;
  extraStyle?: any;
};
const PlainText = ({text, style, extraStyle}: TyphoDetailProps) => {
  return <Text style={[style, extraStyle]}>{text}</Text>;
};

type TyphoProps = {
  type:
    | 'H1'
    | 'H2'
    | 'H3'
    | 'H4'
    | 'H5'
    | 'SECTION_HEADER'
    | 'LABEL'
    | 'CAPTION'
    | 'ADDRESS';
  text?: string;
  extraStyle?: TextStyle | Array<TextStyle | undefined> | undefined;
};

const Typho = ({type, text, extraStyle}: TyphoProps) => {
  switch (type) {
    case 'H1':
      return <PlainText text={text} style={TS.H1} extraStyle={extraStyle} />;
    case 'H2':
      return <PlainText text={text} style={TS.H2} extraStyle={extraStyle} />;
    case 'H3':
      return <PlainText text={text} style={TS.H3} extraStyle={extraStyle} />;
    case 'H4':
      return <PlainText text={text} style={TS.H4} extraStyle={extraStyle} />;
    case 'H5':
      return <PlainText text={text} style={TS.H5} extraStyle={extraStyle} />;
    case 'SECTION_HEADER':
      return (
        <PlainText
          text={text}
          style={TS.SECTION_HEADER}
          extraStyle={extraStyle}
        />
      );
    case 'LABEL':
      return <PlainText text={text} style={TS.LABEL} extraStyle={extraStyle} />;
    case 'CAPTION':
      return (
        <PlainText text={text} style={TS.CAPTION} extraStyle={extraStyle} />
      );
    case 'ADDRESS':
      return (
        <PlainText text={text} style={TS.ADDRESS} extraStyle={extraStyle} />
      );
    default:
      return <></>;
  }
};

const TS = StyleSheet.create({
  H1: {
    fontFamily: 'AppleSDGothicNeoH',
    fontSize: 40,
  },
  H2: {
    fontFamily: 'AppleSDGothicNeoH',
    fontSize: 30,
  },
  H3: {
    // PAGE HEADER
    fontFamily: 'AppleSDGothicNeoH',
    fontSize: 25,
  },
  H4: {
    // ITEM HEADER
    fontFamily: 'AppleSDGothicNeoB',
    fontSize: 18,
  },
  H5: {
    // ITEM ARTICLE
    fontFamily: 'AppleSDGothicNeoM',
    fontSize: 15,
    flexShrink: 1,
  },
  SECTION_HEADER: {
    fontFamily: 'AppleSDGothicNeoH',
    fontSize: 14,
  },
  LABEL: {
    fontFamily: 'AppleSDGothicNeoEB',
    fontSize: 12,
  },
  CAPTION: {
    fontFamily: 'AppleSDGothicNeoEB',
    fontSize: 12,
    color: 'gray',
  },
  ADDRESS: {
    fontFamily: 'AppleSDGothicNeoM',
    fontSize: 15,
    color: 'black',
  },
});

export default Typho;
