import React, {useCallback, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {connectToDatabase, createTables} from '../database/database';
import TableRow from '../components/TableRow';
import NavBar from '../components/NavBar';

const RecordScreen = () => {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [readings, setReadings] = useState<Array<Object>>([]);
  const [quantity, setQuantity] = useState<Array<Object>>([]);

  const connectDB = useCallback(async () => {
    const connection = await connectToDatabase();
    setDb(connection);
    createTables(connection);
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
        // console.log(JSON.stringify({reading: readingData.rows.raw()}, null, 2));
        setReadings(readingData.rows.raw());

        const [quantityData] = await db.executeSql(
          `select * from FuelQuantity ORDER BY date DESC`,
        );
        // console.log(
        //   JSON.stringify({quantity: quantityData.rows.raw()}, null, 2),
        // );
        setQuantity(quantityData.rows.raw());
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
      <View>
        <NavBar title="History" />
        <View>
          {readings.map((_, i) => {
            return (
              <TableRow
                key={_.id}
                readings={readings}
                quantity={quantity}
                index={i}
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

export default RecordScreen;
