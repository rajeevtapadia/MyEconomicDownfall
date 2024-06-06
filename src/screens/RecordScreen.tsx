import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {WebsqlDatabase} from 'react-native-sqlite-2'
import NavBar from '../components/NavBar';
import TableRow from '../components/TableRow';
import {connectToDatabase} from '../database/database';

const RecordScreen = () => {
  const [db, setDb] = useState<WebsqlDatabase | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [quantity, setQuantity] = useState<Quantity[]>([]);
  const [user, setUser] = useState<User>({});

  const connectDB = useCallback(async () => {
    const connection = await connectToDatabase();
    setDb(connection);
  }, []);

  useEffect(() => {
    connectDB();
  }, [connectDB]);

  // effect to fetch data from db
  useEffect(() => {
    async function fetchRecords() {
      if (db) {
        const [readingData] = await db.executeSql(
          `select * from Reading ORDER BY date DESC`,
        );
        setReadings(readingData.rows.raw());

        const [quantityData] = await db.executeSql(
          `select * from FuelQuantity ORDER BY date DESC`,
        );
        setQuantity(quantityData.rows.raw());

        const [userData] = await db.executeSql(`SELECT * FROM User`);
        setUser(userData.rows.raw()[0]);
      }
    }
    fetchRecords();
  }, [db]);

  if (!db) {
    return <Text>Database error</Text>;
  }
  console.log({readings, quantity});

  if (readings?.length && quantity?.length) {
    return (
      <View style={styles.window}>
        <NavBar title="History" />
        <View>
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
              />
            );
          })}
        </View>
      </View>
    );
  } else {
    return <Text>Loading..</Text>;
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
