import {useQuery} from '@apollo/client';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {GET_ALL_LIVE_STREAMING} from '../../graphql/query/getAllLiveStreaming';
import {RootStackParamList} from '../../navigations/Navigator';

type Props = NativeStackScreenProps<RootStackParamList, 'LiveDetail'>;

interface Stream {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

interface IData {
  getAllLiveStream: {
    liveStreams: Stream[];
    totalCount: number;
  };
}
function Live({navigation}: Props) {
  const [data, setData] = useState<Stream[]>([]);

  const handleDetail = (id: string) => () => {
    navigation.navigate('LiveDetail', {id: id});
  };

  useQuery<IData>(GET_ALL_LIVE_STREAMING, {
    onCompleted: ({getAllLiveStream}) => {
      const {liveStreams} = getAllLiveStream;
      setData(liveStreams);
    },
    onError: e => {
      console.log(e);
    },
    fetchPolicy: 'no-cache',
  });

  return (
    <View style={{flex: 1}}>
      {data.map(item => {
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.component}
            onPress={handleDetail(item.id)}>
            <Text style={styles.font}>{item.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  component: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  font: {
    fontSize: 25,
  },
});

export default Live;
