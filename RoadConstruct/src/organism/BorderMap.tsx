import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import NaverMapView, {
  Coord,
  Marker,
  Polyline,
  Polygon,
} from 'react-native-nmap';

// Basic = 0,
// Navi = 1,
// Satellite = 2,
// Hybrid = 3,
// Terrain = 4,
const BorderMap = () => {
  const geoData = require('~/data/geojson copy.json');
  const polydata = geoData.features;
  const res_data = polydata?.map((it: any) => {
    var kor_name = it.properties.CTP_KOR_NM;
    var double_coords: any = it.geometry.coordinates.map((cur_it: any) => {
      return cur_it.map((coord_it: any) => {
        var latitude: number = parseFloat(coord_it[1]);
        var longitude: number = parseFloat(coord_it[0]);
        return {
          latitude: latitude,
          longitude: longitude,
        };
      });
    });
    var test_coords = double_coords[0];
    var coordinates: Coord[] = double_coords.flat(Infinity);
    return {
      kor_name: kor_name,
      coordinates: coordinates,
      double_coords: double_coords,
      test_coords: test_coords,
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <NaverMapView
        style={{flex: 1}}
        mapType={0}
        zoomControl={true}
        zoomGesturesEnabled={true}
        showsMyLocationButton={true}
        // maxZoomLevel={6}
        center={{
          latitude: 36.260695,
          longitude: 127.610644,
        }}
        onMapClick={(event: any) => {
          console.log(event);
        }}
        nightMode={false}>
        {res_data &&
          res_data?.map((it: any, idx: number) => {
            var kor_name: string = it.kor_name;
            var coordinates: Coord[] = it.coordinates;
            var dobule_coords: Coord[][] = it.double_coords;

            return (
              <Polygon
                key={kor_name}
                coordinates={it.test_coords}
                holes={dobule_coords}
                outlineWidth={1}
                outlineColor={'red'}
                color={'rgba(0,0,0,0.1)'}
              />
            );
          })}
      </NaverMapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default BorderMap;
