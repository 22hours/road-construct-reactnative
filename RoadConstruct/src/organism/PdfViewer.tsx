import React from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import Pdf from 'react-native-pdf';

type Props = {
  pdf_uri: string;
};

const PdfViewer = React.memo(({pdf_uri}: Props) => {
  return (
    <View style={styles.container}>
      <Pdf
        source={{uri: pdf_uri, cache: false}}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`current page: ${page}`);
        }}
        onError={error => {
          console.log(error);
        }}
        onPressLink={uri => {
          console.log(`Link presse: ${uri}`);
        }}
        style={styles.pdf}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default PdfViewer;
