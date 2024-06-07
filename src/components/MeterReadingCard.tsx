import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {WebsqlDatabase} from 'react-native-sqlite-2';
import {recordReading} from '../database/insert-queries';

interface Props {
  db: WebsqlDatabase;
  setSnackbar: (value: boolean) => void;
  setSnackbarMsg: (value: string) => void;
}

function MeterReadingCard({db, setSnackbar, setSnackbarMsg}: Props) {
  const [reading, setReading] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onSubmit = () => {
    if (!reading || !date) {
      setSnackbarMsg('Please fill all fields');
      setSnackbar(true);
      setTimeout(() => {
        setSnackbar(false);
      }, 1000);
      return;
    }
    try {
      recordReading(db, reading, date);
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
      <Text>Meter Reading</Text>
      <View style={styles.row}>
        <TextInput
          label="Reading"
          mode="outlined"
          textColor="white"
          keyboardType="numeric"
          style={styles.reading}
          onChangeText={text => {
            setReading(+text);
          }}
        />

        <TextInput
          label="Date"
          value={date ? date.toLocaleDateString() : ''}
          mode="outlined"
          textColor="white"
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
  reading: {
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

export default MeterReadingCard;
