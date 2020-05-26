import { typeDefs, resolvers } from './schema/jsSchema';
require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const PORT = process.env.PORT || 4000

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const SECRET = process.env.SECRET;

const app = express();

app.use(cors('*'));
app.use('/graphiql', graphqlExpress({
  endpointUTL: 'graphql'
}))

app.use('/graphql', bodyParser.json(), graphqlExpress(
  req => ({
    schema,
    SECRET
  })
))
// server.listen(PORT).then(({ url }) => {
  // console.log(`🚀 Server ready at ${url}`)
// });

app.listen(PORT);




