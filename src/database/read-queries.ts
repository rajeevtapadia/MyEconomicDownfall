import {WebsqlDatabase, SQLResultSetRowList} from 'react-native-sqlite-2';

export async function getFuelQuantityFromDB(
  db: WebsqlDatabase,
): Promise<SQLResultSetRowList> {
  return new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        `SELECT * FROM FuelQuantity ORDER BY date DESC;`,
        [],
        (_tx, result) => {
          resolve(result.rows);
        },
        (_tx, err) => {
          reject(err);
          return false;
        },
      );
    });
  });
}

export async function getReadingsFromDB(
  db: WebsqlDatabase,
): Promise<SQLResultSetRowList> {
  return new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        `SELECT * FROM Reading ORDER BY date DESC;`,
        [],
        (_tx, result) => {
          resolve(result.rows);
        },
        (_tx, err) => {
          reject(err);
          return false;
        },
      );
    });
  });
}

export async function getUserFromDB(
  db: WebsqlDatabase,
): Promise<SQLResultSetRowList> {
  return new Promise((resolve, reject) => {
    db.transaction(txn => {
      txn.executeSql(
        `SELECT * FROM User WHERE id=1.0`,
        [],
        (_tx, result) => {
          resolve(result.rows);
        },
        (_tx, err) => {
          reject(err);
          return false;
        },
      );
    });
  });
}
