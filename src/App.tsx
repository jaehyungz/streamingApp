import React from 'react';
import {ApolloProvider} from '@apollo/client';
import {StatusBar, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import apolloClient from './utils/apolloClient';
import Navigations from './navigations';

function App() {
  const client = apolloClient();
  return (
    <ApolloProvider client={client}>
      <SafeAreaProvider>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />

        <Navigations />
      </SafeAreaProvider>
    </ApolloProvider>
  );
}

export default App;
