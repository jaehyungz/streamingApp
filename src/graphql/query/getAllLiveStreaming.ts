import {gql} from '@apollo/client';

export const GET_ALL_LIVE_STREAMING = gql`
  query getAllLiveStream {
    getAllLiveStream {
      liveStreams {
        id
        name
        created_at
        updated_at
      }
      totalCount
    }
  }
`;
