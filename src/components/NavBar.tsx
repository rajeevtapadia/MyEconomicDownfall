import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface props {
  title: string;
}

const NavBar = ({title}: props) => {
  return (
    <View style={styles.navContainer}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    paddingVertical: 20,
    paddingHorizontal: 35,
    backgroundColor: '#303030',
    width: '100%',
  },
  text: {
    color: 'white',
    fontSize: 24,
  },
});

export default NavBar;
