import React, {Component} from 'react';
import {Text, View, ActivityIndicator, Image, StyleSheet} from 'react-native';
import Theme from '../theme';
const LoadingScreen = ({navigation}) => {
  React.useEffect(() => {
    setTimeout(() => navigation.replace('tab'), 1500);
  }, []);
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../resources/logo.png')} />
      <ActivityIndicator size={'large'} color={Theme.mainColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.whiteColor,
  },
  logo: {
    width: Theme.width * 0.6,
    height: Theme.height * 0.1,
    resizeMode: 'center',
    marginBottom: 20,
  },
});

export default LoadingScreen;
