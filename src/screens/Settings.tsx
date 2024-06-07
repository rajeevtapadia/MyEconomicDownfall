import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Snackbar, Text, TextInput} from 'react-native-paper';
import {WebsqlDatabase} from 'react-native-sqlite-2';
import NavBar from '../components/NavBar';
import {connectToDatabase} from '../database/database';
import {saveUserInfo} from '../database/insert-queries';
import {getUserFromDB} from '../database/read-queries';
import global from '../styles/global';

const Settings = () => {
  const [name, setName] = useState<string>('');
  const [initReading, setInitReading] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);

  const [snackbar, setSnackbar] = useState<boolean>(false);
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');

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
        setSnackbarMsg('Details saved successfully');
        setSnackbar(true);
      }
    } catch (e) {
      console.error(e);
      setSnackbarMsg('Error accessing database');
      setSnackbar(true);
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
            onChangeText={text => {
              setName(text);
            }}
          />
          <TextInput
            label="Initial Reading"
            mode="outlined"
            textColor="white"
            value={initReading !== null ? initReading.toString() : undefined}
            keyboardType="numeric"
            onChangeText={text => {
              setInitReading(+text);
            }}
          />
          <TextInput
            label="Price"
            mode="outlined"
            textColor="white"
            value={price !== null ? price.toString() : undefined}
            keyboardType="numeric"
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
      <Snackbar
        visible={snackbar}
        onDismiss={() => {
          setSnackbar(false);
          setSnackbarMsg('');
        }}
        duration={1000}>
        {snackbarMsg}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  button: {
    maxWidth: 100,
    marginTop: 8,
  },
});

export default Settings;
