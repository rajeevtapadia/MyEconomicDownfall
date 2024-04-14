import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {DefaultTheme, PaperProvider} from 'react-native-paper';
import FuelEntryCard from './src/components/FuelEntryCard';
import MeterReadingCard from './src/components/MeterReadingCard';
import NavBar from './src/components/NavBar';
import StatsCard from './src/components/StatsCard';
import {
  allFuelEntries,
  allReading,
  clearDatabase,
  connectToDatabase,
  createTables,
} from './src/database/database';
import global from './src/styles/global';
import {SQLiteDatabase} from 'react-native-sqlite-storage';

function App() {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const darkTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: 'rgb(220, 184, 255)',
      accent: '#ffc107',
      background: '#1F1F1F',
      surface: '#121212',
      text: '#fff',
    },
    roundness: 4, // Adjust corner radius if needed
  };

  const connectDB = useCallback(async () => {
    const connection = await connectToDatabase();
    setDb(connection);
    createTables(connection);
  }, []);

  useEffect(() => {
    connectDB();
  }, [connectDB]);

  allFuelEntries(db);
  allReading(db);
  // clearDatabase(db);

  return (
    <PaperProvider theme={darkTheme}>
      <SafeAreaView>
        {db ? (
          <View style={global.window}>
            <NavBar title="Dashboard" />
            <StatsCard db={db} />
            <View>
              <FuelEntryCard db={db} />
              <MeterReadingCard db={db} />
            </View>
          </View>
        ) : (
          <Text>Error Cant Connect to Database</Text>
        )}
      </SafeAreaView>
    </PaperProvider>
  );
}

export default App;
