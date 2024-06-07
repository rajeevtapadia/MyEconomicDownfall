import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

interface props {
  readings: Reading[];
  quantity: Quantity[];
  index: number;
  user: User;
}

const TableRow = ({readings, quantity, index, user}: props) => {
  const [prevReading, setPrevReading] = useState<string>(
    new Date(0).toISOString(),
  );
  const [fills, setFills] = useState<Quantity[]>([]);
  const [run, setRun] = useState<number>(NaN);

  // effect to find prevReading
  useEffect(() => {
    // if its the row for the last reading
    // ie index + 1 doesn't exits
    if (index === readings.length - 1) {
      // TODO: set prevReading to initReading in User Obj
      setRun(readings[index].meterReading - user.initReading);
    } else {
      setPrevReading(readings[index + 1].date);
      setRun(readings[index].meterReading - readings[index + 1].meterReading);
    }
  }, [index, readings, user]);

  // effect for getting the fills in required range
  useEffect(() => {
    const requiredRec = [];
    const end = readings[index].date;

    // brute force go brr
    for (let i = quantity.length - 1; i >= 0; i--) {
      if (quantity[i].date <= end && quantity[i].date >= prevReading) {
        requiredRec.push(quantity[i]);
      }
    }
    setFills(requiredRec);
  }, [index, prevReading, quantity, readings]);

  return (
    <View style={styles.container}>
      <View>
        {fills.map((fill, i) => (
          <View key={i}>
            <Text style={styles.text}>
              {fill.quantity} L - {fill.date.split('T')[0]}
            </Text>
          </View>
        ))}
      </View>
      <View>
        <Text style={styles.text}>{run} km</Text>
        <Text style={styles.text}>{readings[index].date.split('T')[0]}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-around',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});

export default TableRow;
