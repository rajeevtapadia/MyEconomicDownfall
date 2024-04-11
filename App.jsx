import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, Text, View, useColorScheme} from 'react-native';
import {PaperProvider, DefaultTheme} from 'react-native-paper';
import {connectToDatabase, createTables} from './src/database/database';
import FuelEntryCard from './src/components/FuelEntryCard';
import NavBar from './src/components/NavBar';
import MeterReadingCard from './src/components/MeterReadingCard';
import global from './src/styles/global';

function App() {
  const [db, setDb] = useState(null);
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

  return (
    <PaperProvider theme={darkTheme}>
      <SafeAreaView>
        <View style={global.window}>
          <NavBar title="Dashboard" />
          <FuelEntryCard />
          <MeterReadingCard />
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default App;
