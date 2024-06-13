import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useContext, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import NavBar from '../components/NavBar';
import TableRow from '../components/history/TableRow';
import {databaseContext} from '../context/databaseContext';
import {
  getFuelQuantityFromDB,
  getReadingsFromDB,
  getUserFromDB,
} from '../database/read-queries';

interface props {
  navigation: NativeStackNavigationProp<any, any>;
}

const RecordScreen = ({navigation}: props) => {
  const [user, setUser] = useState<User | null>(null);

  const contextData = useContext(databaseContext);
  if (contextData === null) {
    throw new Error('Context getting fetched...');
  }
  const {db, readings, quantity, setReadings, setQuantity} = contextData;

  // effect to fetch data from db
  useEffect(() => {
    async function fetchRecords() {
      if (db) {
        const readingData = await getReadingsFromDB(db);
        const quantityData = await getFuelQuantityFromDB(db);
        const userData = await getUserFromDB(db);
        const readingArr = [];

        for (let i = 0; i < readingData.length; i++) {
          readingArr.push(readingData.item(i));
        }
        const quantityArr = [];
        for (let i = 0; i < quantityData.length; i++) {
          quantityArr.push(quantityData.item(i));
        }

        setReadings(readingArr);
        setQuantity(quantityArr);
        if (userData.length > 0) {
          setUser(userData.item(0));
        }
      }
    }
    fetchRecords();
  }, [db, setQuantity, setReadings]);

  if (!db) {
    return (
      <View style={styles.window}>
        <Text>Database error</Text>
      </View>
    );
  } else if (user === null) {
    return (
      <View style={styles.window}>
        <Text>First complete your profile in settings</Text>
      </View>
    );
  }

  if (readings?.length && quantity?.length) {
    return (
      <View style={styles.window}>
        <NavBar title="History" navigation={navigation} />
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.left}>
              <Text style={styles.text}>Fills</Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.text}>Total Run</Text>
            </View>
          </View>
          {readings.map((_, i) => {
            return (
              <TableRow
                key={_.id}
                readings={readings}
                quantity={quantity}
                index={i}
                user={user}
                readingId={_.id}
                navigation={navigation}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  } else {
    return (
      <View style={styles.window}>
        <Text style={styles.text}>No data..</Text>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  window: {
    backgroundColor: '#1F1F1F',
    width: '100%',
    height: '100%',
  },
  container: {
    borderBottomWidth: 2,
    borderColor: '#ccc',
    padding: 10,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  left: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'center',
  },
});

export default RecordScreen;
