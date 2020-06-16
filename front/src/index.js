import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game';
import { BrowserRouter as Router} from 'react-router-dom';
import ApiContext from './context/ApiContext'
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';

import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from '@apollo/react-hooks';

import { InMemoryCache } from 'apollo-cache-inmemory';

const link = new HttpLink({
  uri: "http://localhost:4000/graphql"
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    const token =  JSON.parse(localStorage.getItem('token'));

    // console.log({token})
    if (token) {
      headers = { ...headers, 'authorization': token };
    }

    return { headers };
  });

  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(link),
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