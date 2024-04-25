import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {DefaultTheme, PaperProvider} from 'react-native-paper';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {connectToDatabase, createTables} from './src/database/database';
import Dashboard from './src/screens/Dashboard';
import RecordScreen from './src/screens/RecordScreen';

const Stack = createNativeStackNavigator();

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

  // allFuelEntries(db);
  // allReading(db);
  // clearDatabase(db);

  return (
    <PaperProvider theme={darkTheme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="records"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="dashboard" component={Dashboard} />
          <Stack.Screen name="records" component={RecordScreen}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
