import React from 'react';
import {
  SafeAreaView,
  View,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {getDistance, getPreciseDistance} from 'geolib';
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';
import Theme from '../theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import api from '../api/api';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MapScreen = ({navigation}) => {
  const [pharmacies, setPharmacies] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [initialPosition, setInitialPosition] = React.useState({
    latitude: 33.2591422,
    longitude: -8.5124015,
    latitudeDelta: 0.0023,
    longitudeDelta: 0.01,
  });
  const mapRef = React.useRef(null);
  React.useEffect(() => {
    Geolocation.getCurrentPosition(async (position) => {
      let initialPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.0000009,
        longitudeDelta: 0.035,
      };

      await setInitialPosition(initialPosition);
      // @ts-ignore
      mapRef.current?.animateCamera({center: position.coords, zoom: 15});
    });
  }, []);

  const calculateDistance = (latitude, longitude) => {
    let dis = getDistance(
      {
        latitude: initialPosition.latitude,
        longitude: initialPosition.longitude,
      },
      {latitude: latitude, longitude: longitude},
    );

    if (dis > 1000) {
      let num = parseFloat(dis / 1000);
      let cal = num.toFixed(1);
      return cal + ' km';
    } else {
      return dis + ' m';
    }
  };

  const getPharmacies = async () => {
    const data = new FormData();
    data.append('lat', initialPosition.latitude);
    data.append('lng', initialPosition.longitude);
    try {
      const results = await api
        .post('/pharmacies', data, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            authorization: 'Bearer 6c57f52e2c8cabe497d9e0411b7c7dbb',
          },
        })
        .then((res) => {
          console.log('res: ', res);
          setLoading(false);
          setPharmacies(res.data.response.pharmacies);
        })
        .catch((err) => {
          setLoading(false);
          console.log('winners error');
          alert(err.message);
          console.log(err);
        });
    } catch (err) {
      setLoading(false);
      console.log(err);
      alert(err.message);
    }
  };
  React.useEffect(() => {
    getPharmacies();
  }, [initialPosition]);

  const goToInitialLocation = () => {
    let initialRegion = Object.assign({}, initialPosition);
    // @ts-ignore
    mapRef.current.animateToRegion(initialRegion, 2000);
  };
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={Theme.mainColor} />
      </View>
    );
  }
  const renderItem = (item, index) => {
    return (
      <View
        key={index}
        style={{
          borderRadius: 5,
          borderWidth: 1 / 2,
          borderColor: Theme.lessGrey,
          padding: 15,
          margin: 5,
          backgroundColor: Theme.whiteColor,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.mainText}>{item.item.Name}</Text>
            <Text style={styles.greyText}>{item.item.City}</Text>
            <Text style={styles.greyText}>
              {calculateDistance(item.item.Lat, item.item.Lng)}
            </Text>
            <Text
              style={[
                styles.greyText,
                {color: item.item.Garde_label ? 'green' : 'grey'},
              ]}>
              {item.item.Garde_label
                ? item.item.Garde_label
                : 'Pas de garde (Horaires normaux)'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (Platform.OS === 'android') {
                    Linking.openURL(
                      `geo:0,0?q=${parseFloat(item.item.Lat)},${parseFloat(
                        item.item.Lng,
                      )}`,
                    );
                  } else {
                    Linking.openURL(
                      `maps:0,0?q=${parseFloat(item.item.Lat)},${parseFloat(
                        item.item.Lng,
                      )}`,
                    );
                  }
                }}>
                <View style={styles.button}>
                  <Ionicons name="ios-navigate-circle-sharp" size={20} />
                  <Text style={{margin: 2, fontWeight: '700'}}>Itinéraire</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`tel: ${item.item.Phone}`);
                }}>
                <View style={styles.button}>
                  <Ionicons name="ios-call" size={20} />
                  <Text style={{margin: 2, fontWeight: '700'}}>Appeler</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={{...StyleSheet.absoluteFillObject}}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={{...StyleSheet.absoluteFillObject}}
        ref={mapRef}
        initialRegion={initialPosition}
        showsMyLocationButton={true}
        maxZoomLevel={80}
        followsUserLocation={true}
        showsUserLocation={true}
        onMapReady={() => {
          goToInitialLocation();
        }}>
        {pharmacies &&
          pharmacies.map((item, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: item.Lat,
                longitude: item.Lng,
              }}
              title={item.Name}>
              <FontAwesome name={'map-pin'} size={25} color={'red'} />
            </Marker>
          ))}
      </MapView>
      <FlatList
        data={pharmacies}
        style={styles.carousel}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carousel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingLeft: 5,
    paddingVertical: 5,
  },
  greyText: {
    fontSize: 14,
    flexWrap: 'wrap',
    marginTop: 5,
    color: Theme.grey,
  },
  mainText: {
    fontSize: 15,
    fontWeight: '600',
    flexWrap: 'wrap',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: Theme.lessGrey,
    padding: 5,
    borderRadius: 15,
    paddingHorizontal: 12,
  },
});

export default MapScreen;
