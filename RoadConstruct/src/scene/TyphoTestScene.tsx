import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
// LAYOUT
import SceneHeader from '~/layout/SceneHeader';
import SceneLayout from '~/layout/SceneLayout';

import Typho from '~/Typho';

const ListScene = () => {
  return (
    <>
      <SceneHeader />
      <SceneLayout>
        <Typho type={'H1'} text={'H1 타이포 그래피'} />
        <Typho type={'H2'} text={'H2 타이포 그래피'} />
        <Typho type={'H3'} text={'H3 타이포 그래피'} />
        <Typho type={'H4'} text={'H4 타이포 그래피'} />
        <Typho type={'H5'} text={'H5 타이포 그래피'} />
        <Typho type={'LABEL'} text={'타이포 그래피'} />
        <Typho type={'CAPTION'} text={'타이포 그래피'} />
      </SceneLayout>
    </>
  );
};

const styles = StyleSheet.create({});
export default ListScene;
