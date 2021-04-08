import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

// ORGANISM
import PdfViewer from '~/organism/PdfViewer';

// LAYOUT
import SceneLayout from '~/layout/SceneLayout';
type Props = {
  route: any;
};

const PdfDetailScene = ({route}: Props) => {
  const {pdf_uri} = route.params;
  return (
    <SceneLayout>
      <PdfViewer pdf_uri={pdf_uri} />
    </SceneLayout>
  );
};

const styles = StyleSheet.create({});

export default PdfDetailScene;
