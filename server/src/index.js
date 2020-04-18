import { server } from './schema/jsSchema';
require('dotenv').config();

console.log('server working..');

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});




