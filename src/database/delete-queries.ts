import {WebsqlDatabase} from 'react-native-sqlite-2';

export async function deleteReadingInDB(
  db: WebsqlDatabase,
  reading: Reading,
) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM Reading WHERE id = ?`,
        [reading.id],
        (_tx, results) => {
          resolve(results);
        },
        (_tx, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
}

export async function deleteQuantityItemInDB(
  db: WebsqlDatabase,
  quantity: Quantity,
) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `DELETE FROM FuelQuantity WHERE id = ?`,
        [quantity.id],
        (_tx, results) => {
          resolve(results);
        },
        (_tx, error) => {
          reject(error);
          return false;
        },
      );
    });
  });
}
