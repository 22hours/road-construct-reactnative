import React from 'react';
import {Text, StyleSheet, TextStyle} from 'react-native';

type TyphoDetailProps = {
  text?: string;
  extraStyle?: any;
};
const Title = ({text, extraStyle}: TyphoDetailProps) => {
  console.log(text);
  return <Text style={[TS.H1, extraStyle]}>{text}</Text>;
};

type TyphoProps = {
  type: string;
  text?: string;
  extraStyle?: TextStyle;
};

const Typho = ({type, text, extraStyle}: TyphoProps) => {
  switch (type) {
    case 'H1':
      return <Title text={text} extraStyle={extraStyle} />;
    case 'H2':
      return <Title text={text} extraStyle={extraStyle} />;
    default:
      return <></>;
  }
};

const TS = StyleSheet.create({
  H1: {
    fontFamily: 'Apple',
    fontSize: 20,
  },
  H2: {},
});

export default Typho;
