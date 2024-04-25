import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {DefaultTheme, PaperProvider, Snackbar} from 'react-native-paper';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  allFuelEntries,
  allReading,
  connectToDatabase,
  createTables,
} from './src/database/database';
import global from './src/styles/global';
import Dashboard from './src/screens/Dashboard';

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
      <SafeAreaView>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="dashboard">
            <Stack.Screen
              name="dashboard"
              component={Dashboard}
              initialParams={{db}}
            />
          </Stack.Navigator>
        </NavigationContainer>
        {/* <View style={global.window}>
          {db ? (
            <Dashboard db={db} />
          ) : (
            <Text>Error Cant Connect to Database</Text>
          )}
        </View> */}
      </SafeAreaView>
    </PaperProvider>
  );
}

export default App;
