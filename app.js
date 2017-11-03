const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const functions = require('./functions.js');
const ValidationError = require('./ValidationError');
const winston = require('winston');

// Express
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors({ origin: 'http://localhost:3000' }));

app.get('/', (req, res) => {
    res.send('Use the /posts endpoint');
});

app.get('/posts', (req, res) => {
    functions.getAllPosts().then((response) => {
        res.send(response);
    })
        .catch((err) => {
            res.status(400).json({ error: err.toString() });
        });
});

app.post('/posts', (req, res) => {
    functions.addPost(req.body).then((response) => {
        res.send(response);
    });
});

app.get('/posts/:postID', (req, res) => {
    functions.getPostAndComments(req.params.postID).then((response) => {
        res.send(response);
    })
        .catch((err) => {
            res.status(400).json({ error: err.toString() });
        });
});

app.post('/posts/:postId/comment', (req, res) => {
    functions.addComment(req.params.postId, req.body).then((comment) => {
        res.send(comment);
    }).catch((err) => {
        const errorCode = err instanceof ValidationError ? 400 : 404;
        res.status(errorCode).json({ error: err.message });
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    winston.log('info', `Listening on http://localhost:${port}/`);
});
