import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {WebsqlDatabase} from 'react-native-sqlite-2';
import NavBar from '../components/NavBar';
import EditFills from '../components/history/EditFills';
import EditReadings from '../components/history/EditReadings';
import {connectToDatabase} from '../database/database';
import {
  getFuelQuantityFromDB,
  getReadingsFromDB,
} from '../database/read-queries';

interface props {
  readingId: number;
  navigation: NativeStackNavigationProp<any, any>;
}

const EditScreen = ({navigation}: props) => {
  //   console.log({readingId});
  //   console.log(route.params.readingId);
  const [activePanel, setActivePanel] = useState<string>('reading');
  const [db, setDb] = useState<WebsqlDatabase | null>(null);
  const [fills, setFills] = useState<Quantity[]>([]);
  const [readings, setReadings] = useState<Reading[]>([]);

  const connectDB = useCallback(async () => {
    const connection = await connectToDatabase();
    setDb(connection);
  }, []);

  useEffect(() => {
    connectDB();
  }, [connectDB]);

  // effect for getting the fills and readings from db
  useEffect(() => {
    async function getData() {
      if (db) {
        const readingData = await getReadingsFromDB(db);
        const readingArr = [];
        for (let i = 0; i < readingData.length; i++) {
          readingArr.push(readingData.item(i));
        }

        const fillData = await getFuelQuantityFromDB(db);
        const quantityArr = [];
        for (let i = 0; i < fillData.length; i++) {
          quantityArr.push(fillData.item(i));
        }

        setReadings(readingArr);
        setFills(quantityArr);
      }
    }
    getData();
  }, [db]);

  return (
    <View style={styles.window}>
      <NavBar title="Edit Entries" navigation={navigation} />
      <View style={styles.header}>
        <Text
          style={styles.headerText}
          onPress={() => setActivePanel('reading')}>
          Readings
        </Text>
        <Text style={styles.headerText} onPress={() => setActivePanel('fills')}>
          Fills
        </Text>
      </View>
      <ScrollView>
        {activePanel === 'reading' ? (
          <EditReadings readings={readings} navigation={navigation} />
        ) : (
          <EditFills fills={fills} navigation={navigation} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  window: {
    backgroundColor: '#1F1F1F',
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    color: 'white',
    backgroundColor: 'rgb(220, 184, 255)',
    minHeight: 53,
  },
  headerText: {
    color: 'black',
    fontSize: 20,
  },
});

export default EditScreen;
