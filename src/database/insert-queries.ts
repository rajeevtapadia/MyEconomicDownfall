import {WebsqlDatabase} from 'react-native-sqlite-2'

// these function may throw a error so handle them upon calling

export async function fillFuelEntry(
  db: WebsqlDatabase,
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
  db: WebsqlDatabase,
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

export async function saveUserInfo(
  db: WebsqlDatabase,
  name: string,
  initReading: number,
  price: number,
) {
  try {
    const [result] = await db.executeSql(
      `SELECT COUNT(*) AS count FROM User WHERE id = 1`,
    );
    const count = result.rows.item(0).count;

    if (count === 0) {
      // User doesn't exist, insert new user
      await db.executeSql(
        `INSERT INTO User (id, name, initReading, price) 
        VALUES (?, ?, ?, ?)`,
        [1, name, initReading, price],
      );
    } else {
      // User exists, update user
      await db.executeSql(
        `
        UPDATE User 
        SET name = ?, initReading = ?, price = ?
        WHERE id = ?
      `,
        [name, initReading, price, 1],
      );
    }
  } catch (error) {
    throw error;
  }
}
