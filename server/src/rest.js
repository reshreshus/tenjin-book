const express = require("express");
const multer  = require("multer");
const cors = require("cors");
const app = express();
const path = require('path');

app.use(cors())

const port = 5000
const endpoint = `http://localhost:${port}`;
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

app.use(multer({storage:storageConfig}).single("image"));

app.post("/uploadByFile", function (req, res, next) {
	// console.log({filedata: req.file})
  res.send({
		"success": 1,
		"file": {
			"url": `${endpoint}/media/${req.file.filename}`
		}
	})
});

app.listen(port);

console.log("rest server started")