var admin = require("firebase-admin");
var express = require('express');
var bodyParser = require('body-parser');

var serviceAccount = require("./serviceAccountKey.json");

// Express
var app = express();
var router = express.Router();

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

var db = admin.firestore();
var postsRef = db.collection('posts');
