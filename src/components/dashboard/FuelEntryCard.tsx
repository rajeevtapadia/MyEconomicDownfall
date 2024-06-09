import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {WebsqlDatabase} from 'react-native-sqlite-2';
import {fillFuelEntry} from '../../database/insert-queries';
import {databaseContext} from '../../context/databaseContext';

interface Props {
  db: WebsqlDatabase;
  setSnackbar: (value: boolean) => void;
  setSnackbarMsg: (value: string) => void;
}

function FuelEntryCard({db, setSnackbar, setSnackbarMsg}: Props) {
  const [quantity, setQuantity] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const contextData = useContext(databaseContext);
  if (!contextData) {
    throw new Error('Context getting fetched...');
  }
  const {setQuantity: setQuantityInContext} = contextData;

  const onSubmit = () => {
    if (!quantity || !date) {
      setSnackbarMsg('Please fill all fields');
      setSnackbar(true);
      return;
    }
    try {
      fillFuelEntry(db, quantity, date);
      setSnackbarMsg('Added Successfully');
      setSnackbar(true);
    } catch (e) {
      console.error(e);
      setSnackbarMsg('Error accessing database');
      setSnackbar(true);
    }
  };

  const onChangeDate = (
    _event: DateTimePickerEvent,
    selectedDate: Date | undefined,
  ) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

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
