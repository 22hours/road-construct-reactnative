import React, {useState, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Linking} from 'react-native';
import Popover from 'react-native-popover-view';
import Share from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';

// UTILS
import {toastAlert} from '~/util';

// ICONS
import Icon_Feather from 'react-native-vector-icons/Feather';
import Typho from '~/Typho';
import Color from '~/Color';

type Props = {
  label?: string;
  value?: string;
};

const AddressText = ({label, value}: Props) => {
  const touchable = useRef<any>();
  const [showPopover, setShowPopover] = useState(false);

  const dispatch = async (type: string) => {
    switch (type) {
      case 'MAP': {
        const deeplink = `nmap://search?query=${value}&appname=com.roadconstruct`;
        const navermap_uri = `https://m.map.naver.com/search2/search.naver?query=${value}`;

        const isSupportedURL = await Linking.canOpenURL(deeplink);
        if (isSupportedURL) {
          await Linking.openURL(deeplink);
        } else {
          Linking.openURL(navermap_uri);
        }
        setShowPopover(false);
        break;
      }
      case 'SHARE': {
        const options = {
          message: `${value}`,
        };
        Share.open(options);
        setShowPopover(false);
        break;
      }
      case 'COPY': {
        Clipboard.setString(`${value}`);
        toastAlert('복사되었습니다.');
        setShowPopover(false);
        break;
      }
    }
  };

  return (
    <>
      <TouchableOpacity
        ref={touchable}
        onLongPress={() => setShowPopover(true)}
        delayLongPress={300}>
        <Typho type={'LABEL'} text={label} extraStyle={{color: 'black'}} />
        <Typho
          type={'ADDRESS'}
          text={value}
          extraStyle={[
            styles.text,
            showPopover ? styles.text_on : styles.text_off,
          ]}
        />
      </TouchableOpacity>
      <Popover
        from={touchable}
        isVisible={showPopover}
        onRequestClose={() => setShowPopover(false)}>
        <View style={styles.popover_container}>
          <TouchableOpacity
            onPress={() => dispatch('MAP')}
            style={styles.popover_item}>
            <Icon_Feather name="map-pin" style={styles.popover_item__icon} />
            <Typho
              type={'CAPTION'}
              text={'지도'}
              extraStyle={styles.popover_item__text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => dispatch('SHARE')}
            style={styles.popover_item}>
            <Typho
              type={'CAPTION'}
              text={'공유'}
              extraStyle={styles.popover_item__text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => dispatch('COPY')}
            style={styles.popover_item}>
            <Typho
              type={'CAPTION'}
              text={'복사'}
              extraStyle={styles.popover_item__text}
            />
          </TouchableOpacity>
        </View>
      </Popover>
    </>
  );
};

const styles = StyleSheet.create({
  text: {},
  text_on: {
    backgroundColor: Color.DRAG,
  },
  text_off: {},

  popover_container: {
    flex: 1,
    flexDirection: 'row',
  },
  popover_item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    padding: 10,
  },
  popover_item__icon: {
    marginRight: 5,
  },
  popover_item__text: {
    fontSize: 14,
    color: 'black',
  },
});

export default AddressText;
