import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {databaseContext} from '../../context/databaseContext';
import {deleteQuantityItemInDB} from '../../database/delete-queries';
import {updateQuantityInDB} from '../../database/update-queries';

interface props {
  quantity: Quantity;
  setQuantity: React.Dispatch<React.SetStateAction<Quantity | null>>;
  setSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
  setSnackbarMsg: React.Dispatch<React.SetStateAction<string>>;
}

const UpdateQuantityForm = ({
  quantity: quantityItem,
  setQuantity: setQuantityItem,
  setSnackbar,
  setSnackbarMsg,
}: props) => {
  const [date, setDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const contextData = useContext(databaseContext);
  if (!contextData) {
    throw new Error('Context getting fetched...');
  }
  const {db, quantity, setQuantity} = contextData;

  const onSubmit = () => {
    if (!quantityItem.quantity || !date) {
      setSnackbarMsg('Please fill all fields');
      setSnackbar(true);
      return;
    }
    try {
      updateQuantityInDB(db, quantityItem);
      setSnackbarMsg('Added Successfully');
      setSnackbar(true);
      // TODO update the state of the quantity in context
      const newQuantity = quantity.map(item => {
        if (item.id === quantityItem.id) {
          return quantityItem;
        }
        return item;
      });
      setQuantity(newQuantity);
    } catch (e) {
      console.error(e);
      setSnackbarMsg('Error accessing database');
      setSnackbar(true);
    }
  };

  const onDelete = () => {
    try {
      // delete the quantityItem in database
      deleteQuantityItemInDB(db, quantityItem);
      setSnackbarMsg('Deleted Successfully');
      setSnackbar(true);

      // update the state of the quantity in context
      const newQuantity = quantity.filter(item => item.id !== quantityItem.id);
      setQuantity(newQuantity);
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
          value={quantityItem.quantity.toString()}
          textColor="white"
          keyboardType="numeric"
          // style={styles.quantity}
          onChangeText={text => {
            const newQuantity = {...quantityItem, quantity: +text};
            setQuantityItem(newQuantity);
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
  container: {
    padding: 8,
  },
  button: {
    maxWidth: 100,
    marginTop: 8,
  },
});
export default UpdateQuantityForm;
