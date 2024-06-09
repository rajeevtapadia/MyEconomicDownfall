import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {WebsqlDatabase} from 'react-native-sqlite-2';
import {updateQuantityInDB} from '../../database/update-queries';

interface props {
  db: WebsqlDatabase;
  quantity: Quantity;
  setQuantity: React.Dispatch<React.SetStateAction<Quantity | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarMsg: React.Dispatch<React.SetStateAction<string>>;
}

const UpdateQuantityForm = ({
  db,
  quantity,
  setQuantity,
  setSnackbar,
  setSnackbarMsg,
}: props) => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onSubmit = () => {
    if (!quantity.quantity || !date) {
      setSnackbarMsg('Please fill all fields');
      setSnackbar(true);
      return;
    }
    try {
      updateQuantityInDB(db, quantity);
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
    <View>
      <View>
        <TextInput
          label="Quantity"
          mode="outlined"
          value={quantity.quantity.toString()}
          textColor="white"
          keyboardType="numeric"
          // style={styles.quantity}
          onChangeText={text => {
            const newQuantity = {...quantity, quantity: +text};
            setQuantity(newQuantity);
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
  container: {
    padding: 8,
  },
  button: {
    maxWidth: 100,
    marginTop: 8,
  },
});
export default UpdateQuantityForm;
