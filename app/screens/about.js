import {ThemeProvider} from '@react-navigation/native';
import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Theme from '../theme';
import {WebView} from 'react-native-webview';

const AboutScreen = () => {
  return <WebView source={{uri: 'https://pharmagarde.ma/a-propos/'}} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AboutScreen;
