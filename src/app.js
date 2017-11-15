const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const functions = require('./functions.js');
const NotFoundError = require('./NotFoundError');
const ValidationError = require('./ValidationError');
const winston = require('winston');

// Express
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Use the /posts endpoint');
});

app.get('/posts', (req, res, next) => {
    functions.getAllPosts().then((response) => {
        res.send(response);
    }).catch(next);
});

app.post('/posts', (req, res, next) => {
    functions.addPost(req.body).then((response) => {
        res.send(response);
    }).catch(next);
});

app.get('/posts/:postID', (req, res, next) => {
    functions.getPostAndComments(req.params.postID).then((response) => {
        res.send(response);
    }).catch(next);
});

app.post('/posts/:postId/comment', (req, res, next) => {
    functions.addComment(req.params.postId, req.body).then((comment) => {
        res.send(comment);
    }).catch(next);
});

app.use((err, req, res, next) => {
    if (!err) next();
    let errorCode = 500;
    if (err instanceof ValidationError) {
        errorCode = 400;
    } else if (err instanceof NotFoundError) {
        errorCode = 404;
    }
    res.status(errorCode).json({ error: err.toString() });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    winston.log('info', `Listening on http://localhost:${port}/`);
});
