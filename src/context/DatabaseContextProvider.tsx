import React, {useCallback, useEffect} from 'react';
import {WebsqlDatabase} from 'react-native-sqlite-2';
import {connectToDatabase, createTables} from '../database/database';
import {
  getFuelQuantityFromDB,
  getReadingsFromDB,
  getUserFromDB,
} from '../database/read-queries';
import {databaseContext} from './databaseContext';

interface DatabaseContextProviderProps {
  children: React.ReactNode;
}

const DatabaseContextProvider: React.FC<DatabaseContextProviderProps> = ({
  children,
}) => {
  const [db, setDb] = React.useState<WebsqlDatabase | null>(null);
  const [readings, setReadings] = React.useState<Reading[]>([]);
  const [quantity, setQuantity] = React.useState<Quantity[]>([]);
  const [userTable, setUserTable] = React.useState<User[]>([]);

  const connectDB = useCallback(async () => {
    const connection = await connectToDatabase();
    createTables(connection);
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

        const userData = await getUserFromDB(db);
        const userArr = [];
        for (let i = 0; i < userData.length; i++) {
          userArr.push(userData.item(i));
        }
        // console.log(readingArr.length, quantityArr, userArr)
        setReadings(readingArr);
        setQuantity(quantityArr);
        setUserTable(userArr);
      }
    }
    getData();
  }, [db]);

  return (
    <databaseContext.Provider
      value={{
        db,
        readings,
        quantity,
        userTable,
        setDb,
        setReadings,
        setQuantity,
        setUserTable,
      }}>
      {children}
    </databaseContext.Provider>
  );
};

export default DatabaseContextProvider;
