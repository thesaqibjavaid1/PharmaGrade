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
} from 'react-native';
import Theme from '../theme';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
          Alert.alert(err.message);
          console.log(err);
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
          </View>
          <View
            style={{
              flex: 0.3,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
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
              <Ionicons name="ios-navigate-circle-sharp" size={25} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`tel: ${item.item.Phone}`);
              }}>
              <Ionicons name="ios-call" size={25} />
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
        keyExtractor={(item, index) => (item + index).toString()}
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
  },
  mainText: {
    fontSize: 15,
    fontWeight: '600',
  },
  leftButtton: {
    borderWidth: 1 / 2,
    borderColor: Theme.lessGrey,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
});

export default ListScreen;
