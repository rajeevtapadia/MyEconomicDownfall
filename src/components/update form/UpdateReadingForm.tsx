import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {WebsqlDatabase} from 'react-native-sqlite-2';
import {updateReadingInDB} from '../../database/update-queries';

interface props {
  db: WebsqlDatabase;
  reading: Reading;
  setReading: React.Dispatch<React.SetStateAction<Reading | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarMsg: React.Dispatch<React.SetStateAction<string>>;
}

const UpdateReadingForm = ({
  db,
  reading,
  setReading,
  setSnackbar,
  setSnackbarMsg,
}: props) => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onSubmit = () => {
    if (!reading || !date) {
      setSnackbarMsg('Please fill all fields');
      setSnackbar(true);
      return;
    }
    try {
      updateReadingInDB(db, reading);
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
    <View style={styles.window}>
      <View>
        <TextInput
          label="Reading"
          mode="outlined"
          value={reading.meterReading.toString()}
          textColor="white"
          keyboardType="numeric"
          // style={styles.quantity}
          onChangeText={text => {
            const newReading = {...reading, meterReading: +text};
            setReading(newReading);
          }}
        />
        <TextInput
          label="Date"
          value={date ? date.toLocaleDateString() : ''}
          textColor="white"
          mode="outlined"
          // style={styles.date}
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
};
const styles = StyleSheet.create({
  window: {
    backgroundColor: '#1F1F1F',
    height: '100%',
  },
  button: {
    maxWidth: 100,
    marginTop: 8,
  },
});
export default UpdateReadingForm;
