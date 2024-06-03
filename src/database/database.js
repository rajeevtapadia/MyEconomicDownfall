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
      // throw Error('Could not connect to database');
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
          date DATE
        )
      `);

    await db.executeSql(`
        CREATE TABLE IF NOT EXISTS FuelQuantity (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          quantity REAL,
          date DATE
        )
      `);
    // userId TEXT,
    // FOREIGN KEY (userId) REFERENCES User(id)
  } catch (error) {
    console.error(error);
    throw Error(`Failed to create tables`);
  }
};

export async function printUser(db) {
  const res = await db.executeSql('select * from User');
  console.log('user', JSON.stringify(res[0].rows.raw(), undefined, 2));
}

export async function allReading(db) {
  if (!db) {
    return;
  }
  const res = await db.executeSql('select * from Reading ORDER BY date DESC');
  console.log('reading', JSON.stringify(res[0].rows.raw(), undefined, 2));
}

export async function allFuelEntries(db) {
  if (!db) {
    return;
  }
  const res = await db.executeSql(
    'select * from FuelQuantity ORDER BY date DESC',
  );
  console.log('fuel entries', JSON.stringify(res[0].rows.raw(), undefined, 2));
}

export async function clearDatabase(db) {
  if (!db) {
    return;
  }
  db.executeSql('drop table Reading;');
  db.executeSql('drop table FuelQuantity;');
}
