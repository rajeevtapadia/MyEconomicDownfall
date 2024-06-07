import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
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
  const [snackbar, setSnackbar] = useState<boolean>(true);
  const [snackbarMsg, setSnackbarMsg] = useState<string>(
    'jghkhjghjghjglhjlfg hg ',
  );
  const [db, setDb] = useState<WebsqlDatabase | null>(null);

  const connectDB = useCallback(async () => {
    const connection = await connectToDatabase();
    setDb(connection);
    // console.log(await getFuelQuantityFromDB(connection));
    // console.log(await getUserFromDB(connection));
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
          <FuelEntryCard db={db} />
          <MeterReadingCard db={db} />
        </View>
      </View>
      <Button
        mode="contained-tonal"
        onPress={() => {
          navigation.navigate('records');
        }}>
        History
      </Button>
      {/* <View style={styles.snackbarContainer}>
        <Snackbar
          visible={snackbar}
          onDismiss={() => {
            setSnackbar(false);
            setSnackbarMsg('');
          }}>
          {snackbarMsg}
        </Snackbar>
      </View> */}
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
