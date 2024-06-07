import React from 'react';
import {StyleSheet, View} from 'react-native';
import {IconButton, Text, MD3Colors} from 'react-native-paper';
interface props {
  title: string;
  navigation?: any;
}

const NavBar = ({title, navigation}: props) => {
  return (
    <View style={styles.navContainer}>
      <Text style={styles.text}>{title}</Text>
      {navigation && (
        <IconButton
          icon="account-settings"
          iconColor={MD3Colors.error50}
          size={30}
          onPress={() => navigation.navigate('settings')}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    padding: 5,
    minHeight: 60,
    backgroundColor: '#303030',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: 'white',
    fontSize: 24,
    marginLeft: 15,
  },
});

export default NavBar;
