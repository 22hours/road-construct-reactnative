import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
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

const navermap_uri = (query?: string) =>
  `https://m.map.naver.com/search2/search.naver?query=${query}`;

const AddressText = ({label, value}: Props) => {
  const touchable = useRef<any>();
  const [showPopover, setShowPopover] = useState(false);

  const dispatch = (type: string, param?: any) => {
    switch (type) {
      case 'MAP': {
        Linking.openURL(navermap_uri(value));
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
      <Text>
        <TouchableOpacity
          ref={touchable}
          onLongPress={() => setShowPopover(true)}
          delayLongPress={300}>
          <Typho type={'CAPTION'} text={label} />
          <Typho
            type={'ADDRESS'}
            text={value}
            extraStyle={[
              styles.text,
              showPopover ? styles.text_on : styles.text_off,
            ]}
          />
        </TouchableOpacity>
      </Text>
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
