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
import MapPannel from '~/molecule/MapPannel';

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
  mapType: number;
};

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

  const [mapType, setMapType] = useState<Map['mapType']>(0);
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
          <MapPannel mapType={mapType} setMapType={setMapType} />
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
