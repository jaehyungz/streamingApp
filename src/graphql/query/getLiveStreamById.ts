import {gql} from '@apollo/client';

export const GET_LIVE_STREAMING_BY_ID = gql`
  query getLiveStreamById($streamId: String!) {
    getLiveStreamById(streamId: $streamId) {
      name
      player_hls_playback_url
      created_at
      updated_at
    }
  }
`;
