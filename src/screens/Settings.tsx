import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {WebsqlDatabase} from 'react-native-sqlite-2';
import NavBar from '../components/NavBar';
import {saveUserInfo} from '../database/insert-queries';
import {connectToDatabase} from '../database/database';
import global from '../styles/global';
import {getUserFromDB} from '../database/read-queries';

const Settings = () => {
  const [name, setName] = useState<string>('');
  const [initReading, setInitReading] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  const [db, setDb] = useState<WebsqlDatabase | null>(null);

  const connectDB = useCallback(async () => {
    const connection = await connectToDatabase();
    setDb(connection);
  }, []);

  useEffect(() => {
    connectDB();
  }, [connectDB]);

  // effect to prefill user data if already exist
  useEffect(() => {
    async function getUserData() {
      if (db) {
        const user = await getUserFromDB(db);
        if (user.length > 0) {
          setName(user.item(0).name);
          setInitReading(user.item(0).initReading);
          setPrice(user.item(0).price);
        }
      }
    }
    getUserData();
  }, [db]);

  if (!db) {
    return <Text>Db not connected...</Text>;
  }

  function saveHandler() {
    try {
      if (db && initReading !== null && price !== null && name !== '') {
        saveUserInfo(db, name, initReading, price);
      }
    } catch (e) {
      // todo: show snackbar for error
      console.log(e);
    }
  }

  return (
    <View style={global.window}>
      <View>
        <NavBar title="Settings" />
        <View style={styles.container}>
          <TextInput
            label="Name"
            mode="outlined"
            textColor="white"
            value={name}
            style={styles.quantity}
            onChangeText={text => {
              setName(text);
            }}
          />
          <TextInput
            label="Initial Reading"
            mode="outlined"
            textColor="white"
            value={initReading ? initReading.toString() : undefined}
            keyboardType="numeric"
            style={styles.quantity}
            onChangeText={text => {
              setInitReading(+text);
            }}
          />
          <TextInput
            label="Price"
            mode="outlined"
            textColor="white"
            value={price ? price.toString() : undefined}
            keyboardType="numeric"
            style={styles.quantity}
            onChangeText={text => {
              setPrice(+text);
            }}
          />
          <Button
            mode="contained-tonal"
            style={styles.button}
            onPress={saveHandler}>
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
