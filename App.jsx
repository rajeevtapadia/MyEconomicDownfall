import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, useColorScheme, View} from 'react-native';
import {connectToDatabase, createTables} from './src/database/database';

function App() {
  const [db, setDb] = useState(null);
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    async function initDb() {
      const connection = await connectToDatabase();
      setDb(connection);
      createTables(connection);
    }
    initDb();
  }, []);

  return (
    <SafeAreaView>
      <View>
        <Text>gg lol</Text>
      </View>
    </SafeAreaView>
  );
}

export default App;
