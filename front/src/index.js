import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game';
import { BrowserRouter as Router} from 'react-router-dom';
import ApiContext from './context/ApiContext'
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';

import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from '@apollo/react-hooks';

import { InMemoryCache } from 'apollo-cache-inmemory';

const env = process.env.NODE_ENV;

const link = new HttpLink({
  uri: env === 'production' ? "https://tripland.org/graphql" : 'http://localhost:4000/graphql'
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    let token =  JSON.parse(localStorage.getItem('token'));

    // console.log({token})
    if (!token) token="dummy"
    // if (token) {
    headers = { ...headers, 'authorization': token };
    // }

    return { headers };
  });

  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      // console.log('GraphQL error', message);

      if (message === 'UNAUTHENTICATED') {
        // signOut(client);
        // console.log("anauthenticated")
        return;
      }
    });
  }

  if (networkError) {
    console.log('Network error', networkError);

    if (networkError.statusCode === 401) {
      // signOut(client);
    }
  }
});

const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(link)),
  // link,
  cache: new InMemoryCache()
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <ApiContext>
            <Router >
                <Game />
            </Router>
        </ApiContext>
    </ApolloProvider>

, document.getElementById('root'));