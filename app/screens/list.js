import React, {Component} from 'react';
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import Theme from '../theme';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ListScreen = ({navigation}) => {
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {}, []);
  const Data = [
    {
      id: 1,
      name: 'This pahrmacy is exist in Lahore. we can find another',
      distance: '4.5km',
    },
    {
      id: 2,
      name: 'This pahrmacy is exist in Islamabad. we can find another',
      distance: '5.5km',
    },
    {
      id: 3,
      name: 'This pahrmacy is exist in Faisalaabd. find another',
      distance: '6.5km',
    },
    {
      id: 4,
      name: 'This pahrmacy is exist in Karachi',
      distance: '6.5km',
    },
  ];
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
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
          <View style={{flex: 0.6}}>
            <Text style={styles.mainText}>{item.item.name}</Text>
            <Text style={styles.greyText}>Pharmacy</Text>
            <Text style={styles.greyText}>{item.item.distance}</Text>
            <Text style={styles.greyText}>Closed. Open 09:00 Mon</Text>
          </View>
          <View
            style={{
              flex: 0.4,
              height: 30,
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TouchableOpacity onPress={() => {}}>
              <View style={[styles.leftButtton, {marginLeft: 10}]}>
                <Text>Call</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <View style={[styles.leftButtton, {marginLeft: 10}]}>
                <Text>Navigate</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={Data}
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
