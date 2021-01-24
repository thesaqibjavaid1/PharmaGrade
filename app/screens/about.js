import {ThemeProvider} from '@react-navigation/native';
import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Theme from '../theme';
const AboutScreen = () => {
  return (
    <View style={styles.container}>
      <Text>About Screen </Text>
    </View>
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
