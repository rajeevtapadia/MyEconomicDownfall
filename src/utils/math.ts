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

// calculates the most recent fill's avg
export async function calcLatestFillAvg(db: SQLiteDatabase): Promise<number> {
  try {
    const [readingQuery] = await db.executeSql(`
      SELECT * FROM Reading ORDER BY date DESC;
    `);

    const readingData = readingQuery.rows.raw();

    let lastReading = readingData[0];
    let secondLastR = readingData[1];

    const lastFill = await calcFillTill(db, secondLastR.date, lastReading.date);

    const latestFillAvg =
      (lastReading.meterReading - secondLastR.meterReading) / lastFill;

    return latestFillAvg;
  } catch (error) {
    console.log(error);
    return NaN;
  }
}

// calculates fuel consumption between a range of date
export async function calcFillTill(
  db: SQLiteDatabase,
  start: string,
  end: string,
): Promise<number> {
  try {
    const [fuelQuery] = await db.executeSql(`
      SELECT * FROM FuelQuantity ORDER BY date DESC;
    `);

    const fuelData = fuelQuery.rows.raw();
    let sum = 0;
    for (let i = 0; i < fuelData.length; i++) {
      if (fuelData[i].date <= end && fuelData[i].date >= start) {
        sum += fuelData[i].quantity;
      }
    }

    console.log({sum, start, end});
    return sum;
  } catch (e) {
    console.error(e);
    return NaN;
  }
}
