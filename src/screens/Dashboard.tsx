import React, {useState, useCallback, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Snackbar, Text} from 'react-native-paper';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import FuelEntryCard from '../components/FuelEntryCard';
import MeterReadingCard from '../components/MeterReadingCard';
import NavBar from '../components/NavBar';
import StatsCard from '../components/StatsCard';
import global from '../styles/global';
import {connectToDatabase, createTables} from '../database/database';

const Dashboard = () => {
  const [snackbar, setSnackbar] = useState<boolean>(true);
  const [snackbarMsg, setSnackbarMsg] = useState<string>(
    'jghkhjghjghjglhjlfg hg ',
  );
  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  const connectDB = useCallback(async () => {
    const connection = await connectToDatabase();
    setDb(connection);
    createTables(connection);
  }, []);

  useEffect(() => {
    connectDB();
  }, [connectDB]);

  if (!db) {
    return <Text>Db not connected...</Text>;
  }

  return (
    <View style={global.window}>
      <View>
        <NavBar title="Dashboard" />
        <StatsCard db={db} />
        <View>
          <FuelEntryCard db={db} />
          <MeterReadingCard db={db} />
        </View>
      </View>
      <View style={styles.snackbarContainer}>
        <Snackbar
          visible={snackbar}
          onDismiss={() => {
            setSnackbar(false);
            setSnackbarMsg('');
          }}>
          {snackbarMsg}
        </Snackbar>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  snackbarContainer: {
    flex: 1,
    justifyContent: 'space-between',
    maxHeight: 45,
    borderRadius: 10,
    marginBottom: 10,
    marginHorizontal: 5,
  },
});

export default Dashboard;
