import express from 'express';
import graphqlHTTP from 'express-graphql';
import schema from './schema/schema';
import cors from 'cors';
require('dotenv').config();

console.log('server working..');

const app = express();

// Allow CORS  
app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true 
}));

app.listen(4000, () => {
    console.log("listening!2");
})
