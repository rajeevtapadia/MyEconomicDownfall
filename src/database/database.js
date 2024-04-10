import {enablePromise, openDatabase} from 'react-native-sqlite-storage';

// Enable promise for SQLite
enablePromise(true);

export const connectToDatabase = async () => {
  return openDatabase(
    {name: 'fuelConsumption.db', location: 'default'},
    () => {
      console.log('db connected');
    },
    error => {
      console.error(error);
      throw Error('Could not connect to database');
    },
  );
};

export const createTables = async db => {
  try {
    await db.executeSql(`
        CREATE TABLE IF NOT EXISTS User (
          id TEXT PRIMARY KEY,
          name TEXT,
          initReading REAL,
          price REAL
        )
      `);

    await db.executeSql(`
        CREATE TABLE IF NOT EXISTS Reading (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          meterReading REAL,
          date DATE,
          userId TEXT,
          FOREIGN KEY (userId) REFERENCES User(id)
        )
      `);

    await db.executeSql(`
        CREATE TABLE IF NOT EXISTS FuelQuantity (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          quantity REAL,
          date DATE,
          userId TEXT,
          FOREIGN KEY (userId) REFERENCES User(id)
        )
      `);
  } catch (error) {
    console.error(error);
    throw Error(`Failed to create tables`);
  }
};

async function test(db) {
  const res = await db.executeSql('select * from User');
  console.log(JSON.stringify(res[0].rows.raw(), undefined, 2));
}
