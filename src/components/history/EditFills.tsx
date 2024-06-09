import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import React, {useCallback} from 'react';

interface props {
  fills: Quantity[];
  navigation: NativeStackNavigationProp<any, any>;
}

const EditFills = ({fills, navigation}: props) => {
  return (
    <View>
      {fills.map((fill, i) => (
        <View
          key={i}
          style={styles.container}
          onTouchEnd={() => {
            navigation.push('updateScreen', {fill});
          }}>
          <Text style={styles.text}>
            {fill.quantity} L - {fill.date.split('T')[0]}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-around',
  },
  text: {
    color: 'white',
    fontSize: 16,
  },
});
export default EditFills;
