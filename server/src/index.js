import { server } from './schema/jsSchema';
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




