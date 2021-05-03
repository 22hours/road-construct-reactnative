import React, {useState, useEffect, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Alert,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionSpecs,
} from '@react-navigation/stack';

// LAYOUT
import SceneHeader from '~/layout/SceneHeader';

// SCENE
import MainScene from '~/scene/MainScene';
import ArticleListScene from '~/scene/ArticleListScene';
import ArticleDetailScene from '~/scene/ArticleDetailScene';
import PdfDetailScene from '~/scene/PdfDetailScene';
import MapScene from '~/scene/MapScene';
import ImageWebViewScene from '~/scene/ImageWebViewScene';
import AlarmSettingScene from '~/scene/AlarmSettingScene';
import ArticleNewsScene from '~/scene/ArticleNewsScene';

const Stack = createStackNavigator();
const RouterInner = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        headerMode={'screen'}
        // screenOptions={{
        //   cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        // }}
      >
        <Stack.Screen
          name="MAIN_SCENE"
          component={MainScene}
          options={{
            header: props => <SceneHeader {...props} />,
          }}
        />
        <Stack.Screen
          name="ARTICLE_LIST"
          component={ArticleListScene}
          options={{
            header: props => <SceneHeader {...props} />,
          }}
        />
        <Stack.Screen
          name="ARTICLE_DETAIL"
          component={ArticleDetailScene}
          options={{
            header: props => <SceneHeader {...props} />,
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
        />
        <Stack.Screen
          name="ARTICLE_NEWS"
          component={ArticleNewsScene}
          options={{
            header: props => <SceneHeader {...props} />,
          }}
        />
        <Stack.Screen
          name="ALARM_SETTING"
          component={AlarmSettingScene}
          options={{
            header: props => <SceneHeader {...props} />,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />
        <Stack.Screen
          name="PDF_SCENE"
          component={PdfDetailScene}
          options={{
            header: props => <SceneHeader {...props} />,
          }}
        />
        <Stack.Screen
          name="MAP_SCENE"
          component={MapScene}
          options={{
            header: props => <SceneHeader {...props} />,
          }}
        />
        <Stack.Screen
          name="IMAGE_WEBVIEW_SCENE"
          component={ImageWebViewScene}
          options={{
            header: props => <></>,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const Router = () => {
  return (
    <>
      <RouterInner />
    </>
  );
};

const styles = StyleSheet.create({});

export default Router;
