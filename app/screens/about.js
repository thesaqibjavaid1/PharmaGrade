import {ThemeProvider} from '@react-navigation/native';
import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Theme from '../theme';
import {WebView} from 'react-native-webview';

const AboutScreen = () => {
  return (
    <WebView source={{uri: 'http://pharmagarde.ma/pharmagarde-about.html'}} />
  );
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
