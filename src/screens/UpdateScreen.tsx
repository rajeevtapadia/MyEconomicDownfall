import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Snackbar, Text} from 'react-native-paper';
import {WebsqlDatabase} from 'react-native-sqlite-2';
import NavBar from '../components/NavBar';
import UpdateQuantityForm from '../components/update form/UpdateQuantityForm';
import UpdateReadingForm from '../components/update form/UpdateReadingForm';
import {connectToDatabase} from '../database/database';

interface props {
  route: any;
}

const UpdateScreen = ({route}: props) => {
  const [quantity, setQuantity] = useState<Quantity | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);

  const [snackbar, setSnackbar] = useState<boolean>(false);
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');
  const [db, setDb] = useState<WebsqlDatabase | null>(null);
  ('');
  const connectDB = useCallback(async () => {
    const connection = await connectToDatabase();
    setDb(connection);
  }, []);

  useEffect(() => {
    connectDB();
  }, [connectDB]);

  useEffect(() => {
    if (route.params.fill) {
      setQuantity(route.params.fill);
    } else {
      setReading(route.params.reading);
    }
  }, [route.params]);

  if (db === null) {
    return <Text>DB not connected</Text>;
  }

  return (
    <View style={styles.window}>
      <NavBar title="Update Entry" />
      {quantity && (
        <UpdateQuantityForm
          db={db}
          quantity={quantity}
          setQuantity={setQuantity}
          setSnackbar={setSnackbar}
          setSnackbarMsg={setSnackbarMsg}
        />
      )}
      {reading && (
        <UpdateReadingForm
          db={db}
          reading={reading}
          setReading={setReading}
          setSnackbar={setSnackbar}
          setSnackbarMsg={setSnackbarMsg}
        />
      )}
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
  window: {
    backgroundColor: '#1F1F1F',
    height: '100%',
  },
  container: {
    padding: 8,
  },
});
export default UpdateScreen;
