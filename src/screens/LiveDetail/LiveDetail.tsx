import {useLazyQuery} from '@apollo/client';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {GET_LIVE_STREAMING_BY_ID} from '../../graphql/query/getLiveStreamById';
import {RootStackParamList} from '../../navigations/Navigator';

import Video from 'react-native-video';

type Props = NativeStackScreenProps<RootStackParamList, 'LiveDetail'>;
interface IData {
  getLiveStreamById: {
    name: string;
    player_hls_playback_url: string;
    created_at: string;
    updated_at: string;
  };
}

function LiveDetail({route}: Props) {
  const [path, setPath] = useState('');
  const [getLiveStreaming] = useLazyQuery<IData>(GET_LIVE_STREAMING_BY_ID, {
    variables: {
      streamId: route.params.id,
    },
    onCompleted: ({getLiveStreamById}) => {
      const {player_hls_playback_url} = getLiveStreamById;
      setPath(player_hls_playback_url);
    },
    onError: e => {
      console.log(e);
    },
    fetchPolicy: 'no-cache',
  });

  useEffect(() => {
    if (route.params.id) {
      getLiveStreaming();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);
  const videoRef = useRef(null);
  return (
    <View style={styles.container}>
      <Video
        source={{uri: path}} // Can be a URL or a local file.
        ref={videoRef} // Store reference
        onError={e => console.log(e)} // Callback when video cannot be loaded
        onBuffer={e => console.log(e)} // Callback when video cannot be loaded
        style={styles.video}
      />
      <View style={styles.ChatContainer} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,

    flexDirection: 'column',
  },
  video: {
    flex: 1.5,
  },
  ChatContainer: {
    flex: 3,
    backgroundColor: '#aaa',
  },
});
export default LiveDetail;
