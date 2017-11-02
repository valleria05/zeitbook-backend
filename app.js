var express = require('express');
var bodyParser = require('body-parser');
var functions = require('./functions.js');

// Express
var app = express();
var router = express.Router();

app.get('/', (req, res) => {
    res.send('Use the /posts endpoint');
});

app.get('/posts', (req, res) => {
    functions.getAllPosts().then(post => {
        res.send(post);
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
