import "core-js/stable";
import "regenerator-runtime/runtime";
require('dotenv').config({path: __dirname + '/.env'});
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
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
  const token = req.headers.authorization;
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
  origin: 'https://tenjin-book.netlify.app/',
  optionsSuccessStatus: 200
}
const app = express();


app.use(process.env.NODE_ENV==='production' ? cors(corsOptions) : cors());


app.use(addUser);
app.use('/graphiql', graphiqlExpress({
  endpointURL: 'graphql'
}))
app.use(addUser);

app.use('/graphql', bodyParser.json(), graphqlExpress(
  req => ({
    schema,
    context: {
      user: req.user,
      SECRET
    }
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
