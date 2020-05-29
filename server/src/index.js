import { typeDefs, resolvers } from './schema/jsSchema';
require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import cors from 'cors';
const multer  = require("multer");
import jwt from 'jsonwebtoken';

const path = require('path');

const PORT = process.env.PORT || 4000

const endpoint = `http://localhost:${PORT}`;

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

const SECRET = process.env.SECRET;

const addUser = async (req) => {
  const token = jwt.headers.authorization;
  try {
    const { user } = await jwt.verify(token, SECRET);
    req.user = user;
  } catch (err) {
    console.error(err);
  }
  req.next();
}


const app = express();

app.use(cors('*'));
app.use('/graphiql', graphqlExpress({
  endpointURL: 'graphql'
}))
// app.use(addUser);

app.use('/graphql', bodyParser.json(), graphqlExpress(
  req => ({
    schema,
    SECRET
  })
))


const dbPath = "C:/Users/Rishat/AppData/Roaming/Tenjin/db"
const mediaFolder = path.join(dbPath, 'media');

app.use('/media', express.static(mediaFolder));

const getDate = (dt = new Date()) => {
  // return `${dt.getFullYear()}${(dt.getMonth() + 1)}${dt.getDate()}`
  return Date.now();
}

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, mediaFolder);
  },
  filename: (req, file, cb) =>{
    cb(null, getDate() + path.extname(file.originalname));
  }
});

app.delete('/media/:name', function (req, res) {
  const fileName = req.params.name;
  const filePath = path.join(mediaFolder, fileName);
  fs.unlinkSync(filePath);
  res.send({
    'status': 'ok'
  })
})

app.use(multer({storage:storageConfig}).single("image"));

app.post("/uploadByFile", function (req, res) {
  // console.log({filedata: req.file})
  res.send({
    "success": 1,
    "file": {
      "url": `${endpoint}/media/${req.file.filename}`
    }
  })
});

app.listen(PORT);




