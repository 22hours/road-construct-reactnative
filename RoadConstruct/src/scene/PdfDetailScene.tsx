import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  TouchableNativeFeedback,
  View,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';

// ORGANISM
import PdfViewer from '~/organism/PdfViewer';

// LAYOUT
import SceneLayout from '~/layout/SceneLayout';
import Color from '~/Color';

// ICONS
import Icon_Entypo from 'react-native-vector-icons/Entypo';
import Typho from '~/Typho';
import {useNavigation} from '@react-navigation/native';
import SceneHeader from '~/layout/SceneHeader';
import Share from 'react-native-share';

type Props = {
  route: any;
};

const FAB_SIZE = 60;

const PdfDetailScene = ({route}: Props) => {
  const navigation = useNavigation();
  const {origin_pdf_uri, pdf_uri_list} = route.params;

  const [nowPdf, setNowPdf] = useState(origin_pdf_uri);
  const [isModalVisible, setIsModalVisble] = useState(false);
  const toggleModal = () => setIsModalVisble(!isModalVisible);

  const changeNowPdf = pdf_url => {
    if (nowPdf === pdf_url) return;
    setNowPdf(pdf_url);
    toggleModal();
  };

  const sharePdf = async () => {
    try {
      const uri = nowPdf;
      const options = {
        title: 'Share Title',
        message: '[PDF 공유]',
        url: uri,
        type: 'pdf',
      };
      await Share.open(options);
    } catch (e) {
      console.log('😻😻😻 snapshot failed', e);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      header: () => <SceneHeader handleShare={() => sharePdf()} />,
    });
  }, [nowPdf]);
  return (
    <SceneLayout>
      <PdfViewer pdf_uri={nowPdf} />
      <Modal isVisible={isModalVisible}>
        <TouchableOpacity
          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
          onPress={() => toggleModal()}>
          <TouchableOpacity activeOpacity={1} style={{padding: 10}}>
            <View style={ST.modal_container}>
              <View style={ST.modal_header}>
                <Typho
                  type={'LABEL'}
                  text={'PDF 선택'}
                  extraStyle={ST.modal_header__text}
                />
              </View>
              <View style={ST.modal_body}>
                <>
                  {pdf_uri_list?.map((it, idx) => {
                    var isReadNow = it.url === nowPdf;
                    return (
                      <TouchableNativeFeedback
                        onPress={() => changeNowPdf(it.url)}
                        key={`MODAL_ITEM::${idx}`}>
                        <View
                          style={[
                            ST.pdf_list_item,
                            isReadNow && ST.pdf_list_item_on,
                          ]}>
                          <Typho type={'H5'} text={it.title} />
                          {isReadNow && (
                            <Typho type={'CAPTION'} text={'현재 열람 중'} />
                          )}
                        </View>
                      </TouchableNativeFeedback>
                    );
                  })}
                </>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
      <>
        {pdf_uri_list?.length >= 1 && (
          <TouchableNativeFeedback onPress={() => setIsModalVisble(true)}>
            <View style={ST.fab_container}>
              <Icon_Entypo name="dots-three-horizontal" style={ST.fab_icon} />
            </View>
          </TouchableNativeFeedback>
        )}
      </>
    </SceneLayout>
  );
};

const ST = StyleSheet.create({
  modal_container: {
    backgroundColor: 'white',
    borderRadius: 5,
    width: 300,
  },
  modal_header: {
    padding: 10,
    borderBottomColor: Color.COMMON.BORDER,
  },
  modal_header__text: {
    color: 'gray',
  },
  modal_body: {
    paddingBottom: 20,
  },
  pdf_list_item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    padding: 10,
  },
  pdf_list_item_on: {
    backgroundColor: Color.COMMON.BORDER,
  },
  fab_container: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    elevation: 11,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: Color.COMMON.PRIMARY,

    justifyContent: 'center',
    alignItems: 'center',
  },
  fab_icon: {
    color: 'white',
    fontSize: 20,
  },
});

export default PdfDetailScene;
