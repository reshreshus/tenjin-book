import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router} from 'react-router-dom';
import ApiContext from './context/ApiContext'

// import 'bootstrap/dist/css/bootstrap.min.css';
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks';

const client = new ApolloClient({
    uri:'http://localhost:4000/graphql'
  })

ReactDOM.render(
    <ApolloProvider client={client}>
        <ApiContext>
            <Router >
                <App />
            </Router>
        </ApiContext>
    </ApolloProvider>

, document.getElementById('root'));
