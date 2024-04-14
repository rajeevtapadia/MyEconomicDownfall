import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {fillFuelEntry} from '../database/crud';

interface Props {
  db: SQLiteDatabase;
}

function FuelEntryCard({db}: Props) {
  const [quantity, setQuantity] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onSubmit = () => {
    if (!quantity || !date) {
      return;
    }
    try {
      fillFuelEntry(db, quantity, date);
    } catch (e) {
      console.error(e);
    }
  };

  const onChangeDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ) => {
    const currentDate = selectedDate || date;
    console.log(currentDate);
    setShowDatePicker(false);
    setDate(currentDate);
  };
  // console.log(date);

  return (
    <View style={styles.container}>
      <Text>Fuel Entry</Text>
      <View style={styles.row}>
        <TextInput
          label="Quantity"
          mode="outlined"
          textColor="white"
          keyboardType="numeric"
          style={styles.quantity}
          onChangeText={text => {
            setQuantity(+text);
          }}
        />

        <TextInput
          label="Date"
          value={date ? date.toLocaleDateString() : ''}
          textColor="white"
          mode="outlined"
          style={styles.date}
          onTouchEnd={() => {
            setShowDatePicker(true);
          }}
        />
        {showDatePicker && (
          <DateTimePicker
            value={date ?? new Date()}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>
      <Button mode="contained-tonal" style={styles.button} onPress={onSubmit}>
        Save
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quantity: {
    flex: 1,
    marginRight: 3,
  },
  date: {
    flex: 1,
    marginLeft: 3,
  },
  button: {
    maxWidth: 100,
    marginTop: 8,
  },
});

export default FuelEntryCard;
