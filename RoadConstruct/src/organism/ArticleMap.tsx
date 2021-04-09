import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ImageBackground,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import NaverMapView, {
  Coord,
  Marker,
  Polyline,
  Polygon,
} from 'react-native-nmap';
import Geolocation from 'react-native-geolocation-service';
import Typho from '~/Typho';
import Color from '~/Color';

// Basic = 0,
// Navi = 1,
// Satellite = 2,
// Hybrid = 3,
// Terrain = 4,

type Props = {
  start_coords: {
    latitude: number;
    longitude: number;
  };
};

type Map = {
  mapType: 0 | 1 | 2 | 3 | 4;
};
const MapTypePanel = ({mapType, setMapType}) => {
  const panel_list = [
    {
      label_text: '지도',
      map_type: 0,
      onPress: () => setMapType(0),
    },
    {
      label_text: '위성',
      map_type: 2,
      onPress: () => setMapType(2),
    },
    {
      label_text: '지적도',
      map_type: 4,
      onPress: () => setMapType(4),
    },
  ];
  return (
    <View style={PST.container}>
      {panel_list.map((it, idx) => {
        return (
          <TouchableOpacity
            style={[
              PST.panel_button,
              it.map_type === mapType && PST.panel_button_on,
            ]}
            onPress={() => it.onPress()}
            key={`MAPTYPEPANEL_${idx}`}>
            <Typho
              type={'LABEL'}
              text={it.label_text}
              extraStyle={[
                PST.panel_button__text,
                it.map_type === mapType && PST.panel_button__text_on,
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
const PST = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'white',
    elevation: 11,
    top: 10,
    left: 20,
    zIndex: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  panel_button: {
    padding: 10,
  },
  panel_button_on: {
    backgroundColor: Color.PRIMARY,
  },
  panel_button__text: {
    color: 'black',
  },
  panel_button__text_on: {
    color: 'white',
  },
});

const ArticleMaker = ({coordinate}) => {
  return (
    <Marker
      width={96}
      height={96}
      coordinate={coordinate}
      onClick={() => console.warn('onClick! p0')}>
      <View style={{backgroundColor: 'rgb(255,0,0)', borderRadius: 80}}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,255,1)',
            borderWidth: 2,
            borderColor: 'black',
            flexDirection: 'row',
          }}>
          <Text>Image</Text>
        </View>
      </View>
    </Marker>
  );
};

const ArticleMap = (props: Props) => {
  const marker_list = [
    {coordinate: {latitude: 37.564362, longitude: 126.977011}},
    {coordinate: {latitude: 37.565051, longitude: 126.978567}},
    {coordinate: {latitude: 37.565383, longitude: 126.976292}},
  ];

  const [mapType, setMapType] = useState<Map['mapType']>();
  const [zoomLevel, setZoomLevel] = useState<number>(12);
  const mapRef = useRef();

  useEffect(() => {
    console.log(zoomLevel);
    console.log(zoomLevel >= 14);
  }, [zoomLevel]);

  useEffect(() => {
    console.log('MAP RENDER');
  });
  return (
    <SafeAreaView style={ST.container}>
      {props && (
        <>
          <MapTypePanel mapType={mapType} setMapType={setMapType} />
          <NaverMapView
            style={{flex: 1}}
            ref={mapRef}
            onCameraChange={event => {
              setZoomLevel(event.zoom);
            }}
            mapType={mapType}
            zoomControl={true}
            zoomGesturesEnabled={true}
            showsMyLocationButton={true}
            center={{
              latitude: 37.564362,
              longitude: 126.977011,
            }}
            // center={{
            //     latitude: props.start_coords.latitude,
            //     longitude: props.start_coords.longitude,
            //   }}
            onMapClick={(event: any) => {}}
            nightMode={false}>
            {zoomLevel >= 14 && (
              <>
                {marker_list.map((it, idx) => (
                  <ArticleMaker
                    key={`MARKER_${idx}`}
                    coordinate={it.coordinate}
                  />
                ))}
              </>
            )}
          </NaverMapView>
        </>
      )}
    </SafeAreaView>
  );
};

const ST = StyleSheet.create({
  container: {
    flex: 1,
  },
  maptype_button_container: {},
});

export default ArticleMap;
