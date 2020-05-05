import { server } from './schema/jsSchema';
require('dotenv').config();

console.log('server working..');

const PORT = process.env.PORT || 4000

server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
});




