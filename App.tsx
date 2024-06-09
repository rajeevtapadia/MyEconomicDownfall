import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {DefaultTheme, PaperProvider, Text} from 'react-native-paper';
import {WebsqlDatabase} from 'react-native-sqlite-2';
import {connectToDatabase, createTables} from './src/database/database';
import Dashboard from './src/screens/Dashboard';
import EditScreen from './src/screens/EditScreen';
import RecordScreen from './src/screens/RecordScreen';
import Settings from './src/screens/Settings';
import UpdateScreen from './src/screens/UpdateScreen';

const Stack = createNativeStackNavigator();

function App() {
  const [db, setDb] = useState<WebsqlDatabase | null>(null);

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

  useEffect(() => {
    const connectDB = async () => {
      const connection = await connectToDatabase();
      createTables(connection);
      setDb(connection);
    };
    connectDB();
  }, []);

  if (!db) {
    return <Text>cannot connect to database</Text>;
  }

  // allFuelEntries(db);
  // allReading(db);
  // clearDatabase(db);

  return (
    <PaperProvider theme={darkTheme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="dashboard"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="dashboard" component={Dashboard} />
          <Stack.Screen name="records" component={RecordScreen}></Stack.Screen>
          <Stack.Screen name="settings" component={Settings}></Stack.Screen>
          <Stack.Screen name="edit" component={EditScreen}></Stack.Screen>
          <Stack.Screen
            name="updateScreen"
            component={UpdateScreen}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
