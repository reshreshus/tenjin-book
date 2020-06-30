import "core-js/stable";
import "regenerator-runtime/runtime";
require('dotenv').config({path: __dirname + '/.env'});
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { uploadFile, getFile, deleteFile } from './db';
import express from 'express';
const fileUpload = require('express-fileupload');
import bodyParser from 'body-parser';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const path = require('path');

const PORT = process.env.PORT || 4000

const clientUrl = process.env.NODE_ENV==='production' ?
'https://jinbook.org': 'http://localhost'
const serverUrl = process.env.NODE_ENV==='production' ?
'https://api.jinbook.org': `http://localhost:${PORT}`


const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const SECRET = process.env.SECRET;

const addUser = async (req) => {
  const token = req.headers.authorization;
  // console.log('addUser', token)
  try {
    const { user } = await jwt.verify(token, SECRET);
    // console.log("User found", user)
    req.user = user;
  } catch (err) {
    // console.log("User not found")
  }
  req.next();
}


const corsOptions = {
  origin: clientUrl,
  optionsSuccessStatus: 200
}
const app = express();


app.use(process.env.NODE_ENV==='production' ? cors(corsOptions) : cors());

app.use(fileUpload({
    createParentPath: true
}));
app.use('/graphiql', graphiqlExpress({
  endpointURL: 'graphql'
}))
app.use(addUser);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))

app.use('/graphql', graphqlExpress(
  req => ({
    schema,
    context: {
      user: req.user,
      SECRET
    }
  })
))

app.get('/media/:uid/:name', async function(req, res) {
  const uid = req.params.uid;
  const name = req.params.name;
  // this is very bad
  const localFilename = `${uid}_${name}`;
  const remoteFilename = `${uid}/${name}`;
  await getFile(localFilename, remoteFilename);
  res.sendFile(localFilename, { root: '.'})
  setTimeout(() => {
    fs.unlink(localFilename, () => { });
  }, 300)
})

app.delete('/media/:name', function (req, res) {
  console.log("app.delete")
  const filename = req.params.name;
  deleteFile(filename);
  res.send({
    'status': 'ok'
  })
})

app.post("/uploadByFile", async function (req, res) {
  const uploadUrl = await uploadFile(req, serverUrl);
  // console.log({uploadUrl})
  res.send({
    "success": 1,
    "file": {
      "url": uploadUrl
    }
  })
});

// Error handler
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const { status } = err;
  res.status(status).json(err);
};
app.use(errorHandler);

app.listen(PORT);
