import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './schema/schema';
import jsSchema from './schema/jsSchema';
import { server } from './schema/jsSchema';
import cors from 'cors';
require('dotenv').config();

console.log('server working..');

// const app = express();

// // Allow CORS  
// app.use(cors());

// app.use('/graphql', graphqlHTTP({
//     jsSchema,
//     graphiql: true 
// }));

// app.listen(4000, () => {
//     console.log("listening!2");
// })

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  });




