import SQLite from 'react-native-sqlite-2';

export const connectToDatabase = async () => {
  return SQLite.openDatabase(
    {name: 'fuelConsumption.db', location: 'default'},
    () => {
      console.log('db connected');
    },
    error => {
      console.error(error);
      // throw Error('Could not connect to database');
    },
  );
};

export const createTables = async db => {
  try {
    db.transaction(txn => {
      txn.executeSql(`
        CREATE TABLE IF NOT EXISTS User (
          id TEXT PRIMARY KEY,
          name TEXT,
          initReading REAL,
          price REAL
        )
      `);

      txn.executeSql(`
        CREATE TABLE IF NOT EXISTS Reading (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          meterReading REAL,
          date DATE
        )
      `);

      txn.executeSql(`
        CREATE TABLE IF NOT EXISTS FuelQuantity (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          quantity REAL,
          date DATE
        )
      `);
    });
  } catch (error) {
    console.error(error);
    throw Error(`Failed to create tables`);
  }
};
