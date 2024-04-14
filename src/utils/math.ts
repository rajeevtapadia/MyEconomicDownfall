import {SQLiteDatabase} from 'react-native-sqlite-storage';

export async function calcOverallAvg(db: SQLiteDatabase) {
  try {
    const [fuelQuery] = await db.executeSql(
      `SELECT * FROM FuelQuantity ORDER BY date DESC;`,
    );

    const [readingQuery] = await db.executeSql(
      `SELECT * FROM Reading ORDER BY date DESC;`,
    );

    const [userQuery] = await db.executeSql(`SELECT * FROM User`);
    const user = userQuery.rows.raw()[0];

    const readingData = readingQuery.rows.raw();
    const latestReading = readingData[0];

    const totalFill = fuelQuery.rows.raw().reduce((prev, curr) => {
      if (curr.date < latestReading.date) {
        return prev + curr.quantity;
      } else {
        return prev;
      }
    }, 0);
    console.log({totalFill});

    const totalDistance =
      (latestReading.meterReading - user.initReading) / totalFill;

    return totalDistance;
  } catch (error) {
    console.log(error);
    return NaN;
  }
}
