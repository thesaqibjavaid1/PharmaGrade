import React, {useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import Theme from '../theme';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import api from '../api/api';
import Geolocation from 'react-native-geolocation-service';
import {getDistance, getPreciseDistance} from 'geolib';

const ListScreen = ({navigation}) => {
  const [initialPosition, setInitialPosition] = React.useState({
    latitude: 52.24416338040521,
    longitude: 21.077596969371196,
    latitudeDelta: 0.09,
    longitudeDelta: 0.035,
  });
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [pharmacies, setPharmacies] = React.useState([]);

  React.useEffect(() => {}, []);

  useEffect(() => {
    Geolocation.getCurrentPosition(async (position) => {
      let initialPosition = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.09,
        longitudeDelta: 0.035,
      };

      await setInitialPosition(initialPosition);
    });
  }, []);
  const getPharmacies = async () => {
    const data = new FormData();
    data.append('lat', initialPosition.latitude);
    data.append('lng', initialPosition.longitude);
    try {
      fetch(
        `https://app.pharmagarde.ma/api/gards/position/${initialPosition.latitude}/${initialPosition.longitude}`,
      )
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          setPharmacies(Object.values(JSON.parse(data)));
        });
    } catch (err) {
      setLoading(false);
      console.log(err);
      Alert.alert(err.message);
    }
  };
  React.useEffect(() => {
    getPharmacies();
  }, [initialPosition]);
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const renderItem = (item, index) => {
    return (
      <View
        key={index}
        style={{
          borderRadius: 5,
          borderWidth: 1 / 2,
          borderColor: Theme.lessGrey,
          padding: 20,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 0.7}}>
            <Text style={styles.mainText}>{'Pharmacie ' + item.item.name}</Text>
            <Text
              style={[
                styles.greyText,
                {color: item.item.garde_label ? 'green' : 'grey'},
              ]}>
              {item.item.garde_label
                ? item.item.garde_label
                : 'Pas de garde (Horaires normaux)'}
            </Text>
            <Text style={styles.greyText}>{item.item.address}</Text>
            {/* <Text style={styles.greyText}>
              {calculateDistance(item.item.lat, item.item.long)}
            </Text> */}
          </View>
          <View
            style={{
              flex: 0.3,
              justifyContent: 'center',
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
              <View style={[styles.button, {backgroundColor: '#56c3d1'}]}>
                <Octicons name="pin" color="red" size={15} />
                <Text style={styles.buttonText}>Itinéraire</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`tel: ${item.item.phone}`);
              }}>
              <View style={[styles.button, {backgroundColor: '#44d79e'}]}>
                <MaterialIcons name="phone" size={15} />
                <Text style={styles.buttonText}>Appeler</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={Theme.mainColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={pharmacies}
        keyExtractor={(item, index) => item + index}
        // @ts-ignore
        renderItem={renderItem}
        ListEmptyComponent={
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{}}>No Record Found</Text>
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.whiteColor,
  },
  iconStyle: {
    marginRight: 20,
  },
  greyText: {
    fontSize: 14,
    flexWrap: 'wrap',
    marginTop: 5,
    color: Theme.grey,
    marginRight: 10,
  },
  mainText: {
    fontSize: 15,
    fontWeight: '600',
    flexWrap: 'wrap',
    marginRight: 15,
  },
  leftButtton: {
    borderWidth: 1 / 2,
    borderColor: Theme.lessGrey,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: Theme.lessGrey,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    height: 35,
    width: 120,
  },
  buttonText: {
    margin: 2,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 7,
  },
});

export default ListScreen;
