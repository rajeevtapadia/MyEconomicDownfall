import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

interface props {
  readings: Array<Object>;
  quantity: Array<Object>;
  index: number;
}

const TableRow = ({readings, quantity, index}: props) => {
  const [prevReading, setPrevReading] = useState<Object>({date: new Date(0)});
  const [fills, setFills] = useState<Array<Object>>([]);

  // effect to find prevReading
  useEffect(() => {
    // if its the row for the last reading
    // ie index + 1 doesn't exits
    if (index === readings.length - 1) {
      // TODO: set prevReading to initReading in User Obj
    } else {
      setPrevReading(readings[index + 1]);
    }
  }, [index, readings]);

  // effect for getting the fills in required range
  useEffect(() => {
    const requiredRec = [];
    const start = prevReading.date;
    const end = readings[index].date;
    // console.log({prev: prevReading.date, curr: readings[index].date});

    // brute force go brr
    for (let i = quantity.length - 1; i >= 0; i--) {
      if (quantity[i].date <= end && quantity[i].date >= start) {
        requiredRec.push(quantity[i]);
      }
    }
    setFills(requiredRec);
    console.log(requiredRec);
  }, [index, prevReading, quantity, readings]);

  return (
    <View style={styles.container}>
      <View>
        <Text>{readings[index].meterReading} ₹</Text>
        <Text>{readings[index].date.split('T')[0]}</Text>
      </View>
      <View>
        {fills.map((fill, i) => (
          <View key={i}>
            <Text>
              {fill.quantity} L - {fill.date.split('T')[0]}
            </Text>
          </View>
        ))}
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
});

export default TableRow;
