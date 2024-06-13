import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {databaseContext} from '../../context/databaseContext';
import {deleteReadingInDB} from '../../database/delete-queries';
import {updateReadingInDB} from '../../database/update-queries';

interface props {
  reading: Reading;
  setReading: React.Dispatch<React.SetStateAction<Reading | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarMsg: React.Dispatch<React.SetStateAction<string>>;
}

const UpdateReadingForm = ({
  reading: readingItem,
  setReading: setReadingItem,
  setSnackbar,
  setSnackbarMsg,
}: props) => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const contextData = useContext(databaseContext);
  if (!contextData) {
    throw new Error('Context getting fetched...');
  }
  const {db, readings, setReadings} = contextData;

  const onSubmit = () => {
    if (!readingItem || !date) {
      setSnackbarMsg('Please fill all fields');
      setSnackbar(true);
      return;
    }
    try {
      // update the reading in the database
      updateReadingInDB(db, readingItem);
      setSnackbarMsg('Added Successfully');
      setSnackbar(true);

      // update the state of the reading in context
      const newReadings = readings.map(item => {
        if (item.id === readingItem.id) {
          return readingItem;
        }
        return item;
      });
      setReadings(newReadings);
    } catch (e) {
      console.error(e);
      setSnackbarMsg('Error accessing database');
      setSnackbar(true);
    }
  };

  const onDelete = () => {
    try {
      // delete the reading in the database
      deleteReadingInDB(db, readingItem);
      setSnackbarMsg('Deleted Successfully');
      setSnackbar(true);

      // update the state of the reading in context
      const newReadings = readings.filter(item => item.id !== readingItem.id);
      setReadings(newReadings);
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
          value={readingItem.meterReading.toString()}
          textColor="white"
          keyboardType="numeric"
          // style={styles.quantity}
          onChangeText={text => {
            const newReading = {...readingItem, meterReading: +text};
            setReadingItem(newReading);
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
      <View>
        <Button mode="contained-tonal" style={styles.button} onPress={onSubmit}>
          Save
        </Button>
        <Button mode="contained-tonal" style={styles.button} onPress={onDelete}>
          Delete
        </Button>
      </View>
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
