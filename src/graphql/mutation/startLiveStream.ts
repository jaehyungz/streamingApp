import {gql} from '@apollo/client';

export const START_LIVE_STREAM = gql`
  mutation startLiveStream($streamId: String!) {
    startLiveStream(streamId: $streamId)
  }
`;
