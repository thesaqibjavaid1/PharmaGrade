import React from 'react';
import {
  Dimensions,
  View,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {getDistance, getPreciseDistance} from 'geolib';
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';
import Theme from '../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
    if (latitude && longitude) {
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
    }
  };

  const getPharmacies = async () => {
    fetch(
      `https://app.pharmagarde.ma/api/gards/position/${initialPosition.latitude}/${initialPosition.longitude}`,
    )
      .then((response) => response.json())
      .then((data) => {
        const d = Object.values(JSON.parse(data));
        console.log(Object.values(JSON.parse(data)));
        mapRef.current?.animateCamera({
          center: {
            latitude: d[0].lat ? d[0].lat : d[39].lat,
            longitude: d[0].long ? d[0].long : d[39].long,
          },
          zoom: 25,
        });
        setLoading(false);
        setPharmacies(Object.values(JSON.parse(data)));
      });
  };
  React.useEffect(() => {
    getPharmacies();
  }, [initialPosition, loading]);

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
          }}>
          <View style={{flex: 1}}>
            <View style={{flex: 0.8}}>
              <Text style={styles.mainText}>
                {'Pharmacie ' + item.item.name}
              </Text>
              <Text style={styles.greyText}>{item.item.address}</Text>
              {/* {item.item.lat && item.item.lat ? (
                <Text style={styles.greyText}>
                  {calculateDistance(item.item.lat, item.item.long)}
                </Text>
              ) : null} */}
              <Text
                style={[
                  styles.greyText,
                  {color: item.item.garde_label ? 'green' : 'grey'},
                ]}>
                {item.item.garde_label
                  ? item.item.garde_label
                  : 'Pas de garde (Horaires normaux)'}
              </Text>
            </View>
            <View
              style={{
                flex: 0.2,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (item.item.lat && item.item.long) {
                    if (Platform.OS === 'android') {
                      Linking.openURL(
                        `geo:0,0?q=${parseFloat(item.item.lat)},${parseFloat(
                          item.item.long,
                        )}`,
                      );
                    } else {
                      Linking.openURL(
                        `maps:0,0?q=${parseFloat(item.item.lat)},${parseFloat(
                          item.item.long,
                        )}`,
                      );
                    }
                  } else {
                    alert('Location not available');
                  }
                }}>
                <View style={[styles.button, {backgroundColor: '#44d79e'}]}>
                  <Octicons name="pin" color="red" size={15} />
                  <Text style={styles.buttonText}>Itinéraire</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(`tel: ${item.item.Phone}`);
                }}>
                <View style={[styles.button, {backgroundColor: '#56c3d1'}]}>
                  <MaterialIcons name="phone" size={15} />
                  <Text style={styles.buttonText}>Appeler</Text>
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
        {pharmacies?.map((item, index) => {
          if (item.lat && item.long) {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(item.lat),
                  longitude: parseFloat(item.long),
                }}
                title={item.name}>
                <Ionicons
                  name={'ios-location-sharp'}
                  size={35}
                  color={'green'}
                />
              </Marker>
            );
          }
        })}
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
    marginVertical: 5,
    color: Theme.grey,
    width: Dimensions.get('screen').width * 0.55,
  },
  mainText: {
    fontSize: 15,
    fontWeight: '600',
    flexWrap: 'wrap',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: Theme.lessGrey,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    height: 35,
    width: 100,
  },
  buttonText: {
    margin: 2,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 5,
  },
});

export default MapScreen;
