const admin = require('firebase-admin');
const NotFoundError = require('./NotFoundError');
const serviceAccount = require('./serviceAccountKey.json');
const ValidationError = require('./ValidationError');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const postsRef = db.collection('posts');

function formatData(doc, propsToRemove = []) {
    if (doc.data()) {
        const data = Object.assign(doc.data(), { id: doc.id });
        propsToRemove.forEach((prop) => {
            delete data[prop];
        });
        return data;
    }
    return undefined;
}

function getAllPosts() {
    const allPosts = [];
    return postsRef.orderBy('time').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            const data = formatData(doc, ['comments', 'token']);
            allPosts.push(data);
        });
        return allPosts;
    }).catch((err) => {
        throw new Error(err);
    });
}

function addPost(postData) {
    if (postData.title && postData.content && postData.user && postData.token) {
        const {
            title, content, user, token, time = new Date(), numComments = 0,
        } = postData;
        return postsRef.add({
            title, content, user, token, time, numComments,
        }).then((ref) => Object.assign({
            title, content, user, token, time, numComments,
        }, { id: ref.id }));
    }
    throw new ValidationError('Object requires title, content, user and registration token');
}

function getComments(postID) {
    const commentsRef = postsRef.doc(postID).collection('comments');
    const allComments = [];
    return commentsRef.orderBy('time').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            allComments.push(formatData(doc, ['token']));
        });
        return allComments;
    });
}

function getPost(postID) {
    return postsRef.doc(postID).get().then((ref) => {
        if (ref.exists) {
            return formatData(ref);
        }
        throw new NotFoundError(`Bad request: No post with ID ${postID}`);
    });
}

function getPostAndComments(postID) {
    return getPost(postID).then((doc) => {
        const post = doc;
        delete post.token;
        return getComments(postID).then((comments) => Object.assign(post, { comments }));
    });
}

function addComment(postID, commentRequest) {
    if (!(postID && commentRequest.comment && commentRequest.user && commentRequest.token)) {
        return Promise.reject(new ValidationError('Object requires comment, user and registration token'));
    }

    return getPost(postID).then((post) => {
        const commentsRef = postsRef.doc(postID).collection('comments');
        const commentData = (({ comment, user, token }) => ({
            comment, user, token, time: new Date(),
        }))(commentRequest);
        // List of commenters' tokens
        const tokens = [];
        commentsRef.get().then((snapshot) => {
            snapshot.forEach((doc) => {
                // Add commenter's token to list of tokens if it hasn't been added already
                const commenterToken = doc.data().token;
                if ((commenterToken !== 'null') && (tokens.indexOf(commenterToken) === -1)) {
                    tokens.push(doc.data().token);
                }
            });
            // Send notifications
            sendNotifications(post.token, tokens, commentData);
        });

        const document = postsRef.doc(postID);
        return commentsRef.add(commentData).then((ref) => db.runTransaction((transaction) => transaction.get(document).then((doc) => {
            const data = doc.data();
            transaction.update(document, {
                numComments: data.numComments + 1,
            });
            return Object.assign(commentData, { id: ref.id });
        })));
    });
}

function sendNotifications(posterToken, commenterTokens, commentData) {
    if (posterToken !== 'null') {
        const posterPayload = {
            notification: {
                title: `${commentData.user} commented on your post`,
                body: `${commentData.user} commented on your post: "${commentData.comment}"`,
            },
        };
        sendNotificationToDevice(posterToken, posterPayload);
    }

    if (commenterTokens.length !== 0) {
        const commenterPayload = {
            notification: {
                title: `${commentData.user} also commented on a post`,
                body: `${commentData.user} also commented on a post: "${commentData.comment}"`,
            },
        };
        sendNotificationToDevice(commenterTokens, commenterPayload);
    }
}

function sendNotificationToDevice(tokens, payload) {
    admin.messaging().sendToDevice(tokens, payload)
        .then((res) => {
            console.log('Notification successfully sent:', res);
        })
        .catch((err) => {
            console.log('Error sending notification:', err);
        });
}

module.exports = {
    getAllPosts, addPost, getPostAndComments, addComment,
};
