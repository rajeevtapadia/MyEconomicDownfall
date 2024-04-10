import React from 'react';
import {SafeAreaView, Text, useColorScheme, View} from 'react-native';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView>
      <View>
        <Text>gg lol</Text>
      </View>
    </SafeAreaView>
  );
}

export default App;
