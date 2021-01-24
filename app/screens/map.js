import React from 'react';
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';
import Theme from '../theme';

const MapScreen = ({navigation}) => {
  const [initialPosition, setInitialPosition] = React.useState({
    latitude: 52.24416338040521,
    longitude: 21.077596969371196,
    latitudeDelta: 0.09,
    longitudeDelta: 0.035,
  });
  const mapRef = React.useRef(null);
  React.useEffect(() => {
    Geolocation.getCurrentPosition(async (position) => {
      let initialPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.09,
        longitudeDelta: 0.035,
      };

      await setInitialPosition(initialPosition);
      // @ts-ignore
      mapRef.current?.animateCamera({center: position.coords, zoom: 15});
    });
  }, []);

  const goToInitialLocation = () => {
    let initialRegion = Object.assign({}, initialPosition);
    // @ts-ignore
    mapRef.current.animateToRegion(initialRegion, 2000);
  };
  return (
    <View style={{...StyleSheet.absoluteFillObject}}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{...StyleSheet.absoluteFillObject}}
        ref={mapRef}
        initialRegion={initialPosition}
        showsMyLocationButton={true}
        followsUserLocation={true}
        showsUserLocation={true}
        onMapReady={() => {
          goToInitialLocation();
        }}></MapView>
    </View>
  );
};

export default MapScreen;
