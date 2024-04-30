import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Card, DefaultTheme, Paragraph, Text, Title} from 'react-native-paper';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {calcLatestFillAvg, calcOverallAvg} from '../utils/math';

interface Props {
  db: SQLiteDatabase;
}

const StatsCard = ({db}: Props) => {
  const [latestAvg, setLatestAvg] = useState<number>(NaN);
  const [overallAvg, setOverallAvg] = useState<number>(NaN);

  useEffect(() => {
    async function setValues() {
      let avg = await calcLatestFillAvg(db);
      setLatestAvg(avg);
      avg = await calcOverallAvg(db);
      setOverallAvg(avg);
      // console.log({fun: await calcLatestFill(db, '2024-04-11 09:27:16')});
    }
    setValues();
  }, [db]);

  return (
    <Card style={styles.cardContainer}>
      <Card.Content>
        <Title>Stats</Title>
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
