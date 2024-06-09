import {WebsqlDatabase} from 'react-native-sqlite-2';
import {
  getFuelQuantityFromDB,
  getReadingsFromDB,
  getUserFromDB,
} from '../database/read-queries';

// these functions may throw error, handling needs to be done
export function calcOverallAvgNew(
  readingData: Reading[],
  fuelData: Quantity[],
  userData: User[],
) {
  if (readingData.length < 1 || userData.length < 1 || fuelData.length < 1) {
    return NaN;
  }

  if (readingData.length < 1) {
    return NaN;
  }
  const latestReading = readingData[0];

  let totalFill = 0;
  for (let i = 0; i < fuelData.length; i++) {
    let curr = fuelData[i];
    // this condition skips adding the fills that are added after latestReading entry
    if (curr.date < latestReading.date) {
      totalFill += curr.quantity;
    }
  }

  const user = userData[0];

  const totalDistance =
    (latestReading.meterReading - user.initReading) / totalFill;

  return totalDistance;
}

export async function calcOverallAvg(db: WebsqlDatabase): Promise<number> {
  try {
    const readingData = await getReadingsFromDB(db);
    if (readingData.length < 1) {
      return NaN;
    }
    const latestReading = readingData.item(0);

    const fuelData = await getFuelQuantityFromDB(db);
    let totalFill = 0;
    for (let i = 0; i < fuelData.length; i++) {
      let curr = fuelData.item(i);
      // this condition skips adding the fills that are added after latestReading entry
      if (curr.date < latestReading.date) {
        totalFill += curr.quantity;
      }
    }

    const user = (await getUserFromDB(db)).item(0);

    const totalDistance =
      (latestReading.meterReading - user.initReading) / totalFill;

    return totalDistance;
  } catch (error) {
    console.error('error in calcOverAll function', error);
    throw error;
  }
}
export function calcLatestFillAvgNew(
  readingData: Reading[],
  fuelData: Quantity[],
  userData: User[],
) {
  if (readingData.length < 1 || userData.length < 1 || fuelData.length < 1) {
    return NaN;
  }
  let secondLastR;
  // if no reading entry is in the table
  if (readingData.length < 1) {
    return NaN;
  } else if (readingData.length < 2) {
    // if there is a single reading entry in the table
    secondLastR = {
      meterReading: userData[0].initReading,
      date: new Date(0),
    };
  } else {
    // if there are two or more reading entries in the table
    secondLastR = readingData[1];
  }
  let lastReading = readingData[0];

  const lastFill = calcFillInIntervalNew(
    fuelData,
    secondLastR.date,
    lastReading.date,
  );

  const latestFillAvg =
    (lastReading.meterReading - secondLastR.meterReading) / lastFill;

  return latestFillAvg;
}
// calculates the most recent fill's avg
export async function calcLatestFillAvg(db: WebsqlDatabase) {
  try {
    const readingData = await getReadingsFromDB(db);

    let secondLastR;
    // if no reading entry is in the table
    if (readingData.length < 1) {
      return NaN;
    } else if (readingData.length < 2) {
      // if there is a single reading entry in the table
      const userData = await getUserFromDB(db);
      secondLastR = {
        meterReading: userData.item(0).initReading,
        date: new Date(0),
      };
    } else {
      // if there are two or more reading entries in the table
      secondLastR = readingData.item(1);
    }
    let lastReading = readingData.item(0);

    const lastFill = await calcFillInInterval(
      db,
      secondLastR.date,
      lastReading.date,
    );
    const latestFillAvg =
      (lastReading.meterReading - secondLastR.meterReading) / lastFill;

    return latestFillAvg;
  } catch (error) {
    console.error('error in calcLatestFillAvg function', error);
    throw error;
  }
}

export function calcFillInIntervalNew(
  fuelData: Quantity[],
  start: string,
  end: string,
): number {
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
}

// calculates fuel consumption between a range of date
export async function calcFillInInterval(
  db: WebsqlDatabase,
  start: string,
  end: string,
): Promise<number> {
  try {
    const fuelData = await getFuelQuantityFromDB(db);
    let sum = 0;
    for (let i = 0; i < fuelData.length; i++) {
      let currentDate = new Date(fuelData.item(i).date);
      let startDate = new Date(start);
      let endDate = new Date(end);
      if (currentDate <= endDate && currentDate >= startDate) {
        sum += fuelData.item(i).quantity;
      }
    }

    return sum;
  } catch (e) {
    console.error('error in calcFillTill function', e);
    throw e;
  }
}
