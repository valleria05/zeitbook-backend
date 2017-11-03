var express = require('express');
var bodyParser = require('body-parser');
var functions = require('./functions.js');

// Express
var app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Use the /posts endpoint');
});

app.get('/posts', (req, res) => {
    functions.getAllPosts().then(response => {
        res.send(response);
    })
    .catch(err => {
        throw new Error(err)
    });
});

app.post('/posts', (req, res) => {
    functions.addPost(req.body).then((response, error) => {
        res.send(response);
    })
    .catch(err => res.err(err));
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
