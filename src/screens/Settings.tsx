import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import NavBar from '../components/NavBar';
import {saveUserInfo} from '../database/crud';
import {connectToDatabase, createTables} from '../database/database';
import global from '../styles/global';

const Settings = () => {
  const [name, setName] = useState<string>('');
  const [initReading, setInitReading] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  const connectDB = useCallback(async () => {
    const connection = await connectToDatabase();
    setDb(connection);
    createTables(connection);
  }, []);

  useEffect(() => {
    connectDB();
  }, [connectDB]);

  // effect to prefill user data if already exist
  useEffect(() => {
    async function getUserData() {
      if (db) {
        const [userData] = await db.executeSql(`SELECT * FROM User`);
        const user = userData.rows.raw();
        if (user.length > 0) {
          setName(user[0].name);
          setInitReading(user[0].initReading);
          setPrice(user[0].price);
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
