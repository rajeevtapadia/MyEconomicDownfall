import React, {useCallback, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import NavBar from '../components/NavBar';
import TableRow from '../components/TableRow';
import {connectToDatabase, createTables} from '../database/database';

const RecordScreen = () => {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [readings, setReadings] = useState<Reading[]>([]);
  const [quantity, setQuantity] = useState<Quantity[]>([]);

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
        setReadings(readingData.rows.raw());

        const [quantityData] = await db.executeSql(
          `select * from FuelQuantity ORDER BY date DESC`,
        );
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
