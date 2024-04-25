import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Snackbar} from 'react-native-paper';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import FuelEntryCard from '../components/FuelEntryCard';
import MeterReadingCard from '../components/MeterReadingCard';
import NavBar from '../components/NavBar';
import StatsCard from '../components/StatsCard';

interface props {
  db: SQLiteDatabase;
}

const Dashboard = ({db}: props) => {
  const [snackbar, setSnackbar] = useState<boolean>(true);
  const [snackbarMsg, setSnackbarMsg] = useState<string>(
    'jghkhjghjghjglhjlfg hg ',
  );

  return (
    <View>
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
