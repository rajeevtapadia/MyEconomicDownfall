import {SQLiteDatabase} from 'react-native-sqlite-storage';

// these function may throw a error so handle them upon calling

export async function fillFuelEntry(
  db: SQLiteDatabase,
  quantity: number,
  date: Date,
) {
  try {
    await db.executeSql(
      `
        INSERT INTO FuelQuantity (quantity, date)
        VALUES (?, ?)
      `,
      [quantity, date.toISOString()],
    );
  } catch (error) {
    throw error;
  }
}

export async function recordReading(
  db: SQLiteDatabase,
  reading: number,
  date: Date,
) {
  try {
    await db.executeSql(
      `
        INSERT INTO Reading (meterReading, date)
        VALUES (?, ?)
      `,
      [reading, date.toISOString()],
    );
  } catch (error) {
    throw error;
  }
}
