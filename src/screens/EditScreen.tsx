import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useContext, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import NavBar from '../components/NavBar';
import EditFills from '../components/history/EditFills';
import EditReadings from '../components/history/EditReadings';
import {databaseContext} from '../context/databaseContext';

interface props {
  readingId: number;
  navigation: NativeStackNavigationProp<any, any>;
}

const EditScreen = ({navigation}: props) => {
  const contextData = useContext(databaseContext);
  if (!contextData) {
    throw new Error('Context getting fetched...');
  }
  const {db, quantity, readings} = contextData;
  const [activePanel, setActivePanel] = useState<string>('reading');

  return (
    <View style={styles.window}>
      <NavBar title="Edit Entries" navigation={navigation} />
      <View style={styles.header}>
        <Text
          style={styles.headerText}
          onPress={() => setActivePanel('reading')}>
          Readings
        </Text>
        <Text style={styles.headerText} onPress={() => setActivePanel('fills')}>
          Fills
        </Text>
      </View>
      <ScrollView>
        {activePanel === 'reading' ? (
          <EditReadings readings={readings} navigation={navigation} />
        ) : (
          <EditFills fills={quantity} navigation={navigation} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  window: {
    backgroundColor: '#1F1F1F',
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    color: 'white',
    backgroundColor: 'rgb(220, 184, 255)',
    minHeight: 53,
  },
  headerText: {
    color: 'black',
    fontSize: 20,
  },
});

export default EditScreen;
