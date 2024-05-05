import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import NavBar from '../components/NavBar';
import global from '../styles/global';

const Settings = () => {
  const [name, setName] = useState<string>('');
  const [initReading, setInitReading] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  // TODO:
  // if user exists fill the data
  // implement saving to db

  return (
    <View style={global.window}>
      <View>
        <NavBar title="Settings" />
        <View style={styles.container}>
          <TextInput
            label="Name"
            mode="outlined"
            textColor="white"
            style={styles.quantity}
          />
          <TextInput
            label="Initial Reading"
            mode="outlined"
            textColor="white"
            keyboardType="numeric"
            style={styles.quantity}
          />
          <TextInput
            label="Price"
            mode="outlined"
            textColor="white"
            keyboardType="numeric"
            style={styles.quantity}
          />
          <Button mode="contained-tonal" style={styles.button}>
            Save
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  quantity: {},
  button: {
    maxWidth: 100,
    marginTop: 8,
  },
});

export default Settings;
