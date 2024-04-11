import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';

interface Props {}

function MeterReadingCard(props: Props) {
  const [reading, setReading] = useState<number | null>(null);
  const [date, setDate] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  console.log(date);

  const onChangeDate = (
    event: DateTimePickerEvent,
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
      <Button mode="contained-tonal" style={styles.button}>
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
