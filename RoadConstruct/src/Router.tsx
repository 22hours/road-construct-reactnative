import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Alert,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// LAYOUT
import SceneHeader from '~/layout/SceneHeader';

// SCENE
import ArticleListScene from '~/scene/ArticleListScene';
import ArticleDetailScene from '~/scene/ArticleDetailScene';
import PdfDetailScene from '~/scene/PdfDetailScene';
import MapScene from '~/scene/MapScene';

const Stack = createStackNavigator();
const Router = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode={'screen'}>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default Router;
