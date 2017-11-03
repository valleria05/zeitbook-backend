var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var functions = require('./functions.js');

// Express
var app = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/', (req, res) => {
    res.send('Use the /posts endpoint');
});

app.get('/posts', (req, res) => {
    functions.getAllPosts().then(response => {
        res.send(response);
    })
    .catch(err => {
        res.status(400).json({ error: err.toString() });
    });
});

app.post('/posts', (req, res) => {
    functions.addPost(req.body).then(response => {
        res.send(response);
    });
});

app.get('/posts/:postID', (req, res) => {
    functions.getPostAndComments(req.params.postID).then(response => {
        res.send(response);
    })
    .catch(err => {
        res.status(400).json({ error: err.toString() });
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
