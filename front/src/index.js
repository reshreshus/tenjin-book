import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
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



const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <ApiContext>
            <Router >
                <App />
            </Router>
        </ApiContext>
    </ApolloProvider>

, document.getElementById('root'));
