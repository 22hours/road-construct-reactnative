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

type Props = {
  address?: string;
};

const navermap_uri = (query?: string) =>
  `https://m.map.naver.com/search2/search.naver?query=${query}`;

const AddressText = ({address}: Props) => {
  const touchable = useRef<any>();
  const [showPopover, setShowPopover] = useState(false);

  const dispatch = (type: string, param?: any) => {
    switch (type) {
      case 'MAP': {
        Linking.openURL(navermap_uri(address));
        setShowPopover(false);
        break;
      }
      case 'SHARE': {
        const options = {
          message: `${address}`,
        };
        Share.open(options);
        setShowPopover(false);
        break;
      }
      case 'COPY': {
        Clipboard.setString(`${address}`);
        toastAlert('복사되었습니다.');
        setShowPopover(false);
        break;
      }
    }
  };

  return (
    <>
      <Text>아래 텍스트를 드래그 하십시오</Text>
      <TouchableOpacity
        ref={touchable}
        onLongPress={() => setShowPopover(true)}
        delayLongPress={300}>
        <Text
          style={[styles.text, showPopover ? styles.text_on : styles.text_off]}>
          {address}
        </Text>
      </TouchableOpacity>
      <Popover
        mode={'rn-modal'}
        from={touchable}
        isVisible={showPopover}
        onRequestClose={() => setShowPopover(false)}>
        <View style={styles.popover_container}>
          <TouchableOpacity
            onPress={() => dispatch('MAP')}
            style={styles.popover_item}>
            <Icon_Feather name="map-pin" style={styles.popover_item__icon} />
            <Text style={styles.popover_item__text}>지도</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => dispatch('SHARE')}
            style={styles.popover_item}>
            <Text style={styles.popover_item__text}>공유</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => dispatch('COPY')}
            style={styles.popover_item}>
            <Text style={styles.popover_item__text}>복사</Text>
          </TouchableOpacity>
        </View>
      </Popover>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
  },
  text_on: {
    backgroundColor: 'red',
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
    fontSize: 15,
  },
});

export default AddressText;
