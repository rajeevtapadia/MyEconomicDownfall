import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Card,
  DefaultTheme,
  Paragraph,
  Text,
  Title,
  IconButton,
} from 'react-native-paper';
import {WebsqlDatabase} from 'react-native-sqlite-2';
import {calcLatestFillAvg, calcOverallAvg} from '../utils/math';

interface Props {
  db: WebsqlDatabase;
}

const StatsCard = ({db}: Props) => {
  const [latestAvg, setLatestAvg] = useState<number>(NaN);
  const [overallAvg, setOverallAvg] = useState<number>(NaN);

  const setValues = useCallback(async () => {
    let avg = await calcLatestFillAvg(db);
    setLatestAvg(avg);
    avg = await calcOverallAvg(db);
    setOverallAvg(avg);
  }, [db]);

  useEffect(() => {
    setValues();
  }, [db, setValues]);
  console.log('status card rendered');

  return (
    <Card style={styles.cardContainer}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title>Stats</Title>
          <IconButton style={styles.refreshButton} icon="refresh" size={22} onPress={setValues}></IconButton>
        </View>
        <View style={styles.contentRow}>
          <View>
            <Paragraph>Latest Avg.</Paragraph>
            <Text style={styles.statValue}>
              {latestAvg ? latestAvg.toFixed(2) + ' km/L' : 'N/A'}
            </Text>
          </View>
          <View>
            <Paragraph>Overall Avg.</Paragraph>
            <Text style={styles.statValue}>
              {overallAvg ? overallAvg.toFixed(2) + ' km/L' : 'N/A'}
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 16,
    backgroundColor: DefaultTheme.colors.primaryContainer,
    marginHorizontal: 10,
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  refreshButton: {
    position: 'relative',
    top: -7,
  },
  border: {
    borderWidth: 1,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statValue: {
    fontSize: 18,
  },
});

export default StatsCard;
