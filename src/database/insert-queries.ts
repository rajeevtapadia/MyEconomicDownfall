import {WebsqlDatabase} from 'react-native-sqlite-2';
import {getUserFromDB} from './read-queries';

// these function may throw a error so handle them upon calling

export async function fillFuelEntry(
  db: WebsqlDatabase,
  quantity: number,
  date: Date,
) {
  try {
    db.transaction(txn => {
      txn.executeSql(
        `
        INSERT INTO FuelQuantity (quantity, date)
        VALUES (?, ?)
      `,
        [quantity, date.toISOString()],
      );
    });
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
    db.transaction(txn => {
      txn.executeSql(
        `
        INSERT INTO Reading (meterReading, date)
        VALUES (?, ?)
      `,
        [reading, date.toISOString()],
      );
    });
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
    const count = await (await getUserFromDB(db)).length;
    db.transaction(async txn => {
      if (count === 0) {
        // User doesn't exist, insert new user
        txn.executeSql(
          `INSERT INTO User (id, name, initReading, price) 
        VALUES (?, ?, ?, ?)`,
          [1, name, initReading, price],
          (tx, result) => console.log('user inserted'),
          (tx, err) => {
            console.log(err);
            return false;
          },
        );
        console.log('gg');
      } else {
        // User exists, update user

        txn.executeSql(
          `
        UPDATE User 
        SET name = ?, initReading = ?, price = ?
        WHERE id = ?
      `,
          [name, initReading, price, 1],
        );
      }
    });
  } catch (error) {
    throw error;
  }
}
