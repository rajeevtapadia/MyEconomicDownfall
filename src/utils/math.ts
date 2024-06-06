import {WebsqlDatabase} from 'react-native-sqlite-2'

export async function calcOverallAvg(db: WebsqlDatabase) {
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
    if (readingData.length < 1) {
      return NaN;
    }
    const latestReading = readingData[0];

    const totalFill = fuelQuery.rows.raw().reduce((prev, curr) => {
      if (curr.date < latestReading.date) {
        return prev + curr.quantity;
      } else {
        return prev;
      }
    }, 0);

    const totalDistance =
      (latestReading.meterReading - user.initReading) / totalFill;

    return totalDistance;
  } catch (error) {
    console.log('error in calcOverAll function', error);
    return NaN;
  }
}

// calculates the most recent fill's avg
export async function calcLatestFillAvg(db: WebsqlDatabase): Promise<number> {
  try {
    const [readingQuery] = await db.executeSql(`
      SELECT * FROM Reading ORDER BY date DESC;
    `);

    const readingData = readingQuery.rows.raw();
    let secondLastR;
    if (readingData.length < 1) {
      return NaN;
    } else if (readingData.length < 2) {
      const [userQuery] = await db.executeSql(`
        SELECT initReading from User WHERE id=1
      `);
      const userData = userQuery.rows.raw();
      secondLastR = {meterReading: userData[0].initReading, date: new Date(0)};
    } else {
      secondLastR = readingData[1];
    }
    let lastReading = readingData[0];

    const lastFill = await calcFillTill(db, secondLastR.date, lastReading.date);
    const latestFillAvg =
      (lastReading.meterReading - secondLastR.meterReading) / lastFill;

    return latestFillAvg;
  } catch (error) {
    console.log('error in calcLatestFillAvg function', error);
    return NaN;
  }
}

// calculates fuel consumption between a range of date
export async function calcFillTill(
  db: WebsqlDatabase,
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
      let currentDate = new Date(fuelData[i].date);
      let startDate = new Date(start);
      let endDate = new Date(end);
      if (currentDate <= endDate && currentDate >= startDate) {
        sum += fuelData[i].quantity;
      }
    }

    return sum;
  } catch (e) {
    console.error('error in calcFillTill function', e);
    return NaN;
  }
}
