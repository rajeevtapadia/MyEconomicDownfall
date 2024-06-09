import {WebsqlDatabase} from 'react-native-sqlite-2';

export function updateReadingInDB(db: WebsqlDatabase, reading: Reading) {
  console.log(reading);
  try {
    const {id, date, meterReading: newReading} = reading;
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Reading SET meterReading = ?, date = ? WHERE id = ?',
        [newReading, date, id],
        (_, results) => console.log(results),
        (_, error) => {
          console.error(error);
          return false;
        },
      );
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export function updateQuantityInDB(db: WebsqlDatabase, quantity: Quantity) {
  try {
    const {id, date, quantity: newQuantity} = quantity;
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE FuelQuantity SET quantity = ?, date = ? WHERE id = ?',
        [newQuantity, date, id],
      );
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
