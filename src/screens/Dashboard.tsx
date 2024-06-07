import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Snackbar, Text} from 'react-native-paper';
import {WebsqlDatabase} from 'react-native-sqlite-2';
import FuelEntryCard from '../components/FuelEntryCard';
import MeterReadingCard from '../components/MeterReadingCard';
import NavBar from '../components/NavBar';
import StatsCard from '../components/StatsCard';
import {connectToDatabase} from '../database/database';
import global from '../styles/global';

interface props {
  navigation: NativeStackNavigationProp<any, any>;
}

const Dashboard = ({navigation}: props) => {
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

  if (!db) {
    return <Text>Db not connected...</Text>;
  }

  return (
    <View style={global.window}>
      <View>
        <NavBar title="Dashboard" navigation={navigation} />
        <StatsCard db={db} />
        <View>
          <FuelEntryCard
            db={db}
            setSnackbar={setSnackbar}
            setSnackbarMsg={setSnackbarMsg}
          />
          <MeterReadingCard
            db={db}
            setSnackbar={setSnackbar}
            setSnackbarMsg={setSnackbarMsg}
          />
        </View>
      </View>
      <Button
        mode="contained-tonal"
        onPress={() => {
          navigation.navigate('records');
        }}>
        History
      </Button>
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

export default Dashboard;
