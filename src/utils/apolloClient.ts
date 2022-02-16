import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

function apolloClient() {
  const BACKEND_URL = 'http://10.10.210.19:3000/graphql';
  const httpLink = new HttpLink({
    uri: BACKEND_URL,
  });

  const client = new ApolloClient({
    link: ApolloLink.from([
      //   withToken,
      //   authMiddleware,
      //   errorLink,
      //   createUploadLink({uri: Config.BACKEND_URL}),
      httpLink,
    ]),
    cache: new InMemoryCache(),
  });

  return client;
}
export default apolloClient;
