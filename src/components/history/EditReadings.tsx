import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import React from 'react';

interface props {
  readings: Reading[];
  navigation: NativeStackNavigationProp<any, any>;
}

const EditReadings = ({readings, navigation}: props) => {
  return (
    <View>
      {readings.map((reading, i) => (
        <View
          key={i}
          style={styles.container}
          onTouchEnd={() => {
            navigation.push('updateScreen', {reading});
          }}>
          <Text style={styles.text}>
            {reading.meterReading} km - {reading.date.split('T')[0]}
          </Text>
        </View>
      ))}
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

export default EditReadings;
