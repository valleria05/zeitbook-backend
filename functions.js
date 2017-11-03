const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const ValidationError = require('./ValidationError');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const postsRef = db.collection('posts');

function formatData(doc) {
    if (doc.data()) {
        return Object.assign(doc.data(), { id: doc.id });
    }
    return undefined;
}

function getAllPosts() {
    const allPosts = [];
    return postsRef.orderBy('time').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            const data = doc.data();
            delete data.comments;
            allPosts.push(Object.assign(data, { id: doc.id }));
        });
        return allPosts;
    })
        .catch((err) => {
            throw new Error(err);
        });
}

function addPost(postData) {
    if (postData.title && postData.content && postData.user) {
        const {
            title, content, user, time = new Date(),
        } = postData;
        return postsRef.add({
            title, content, user, time,
        }).then((ref) => Object.assign({
            title, content, user, time,
        }, { id: ref.id }));
    }
    throw new Error('Object requires title, content and user');
}

function getComments(postID) {
    const commentsRef = postsRef.doc(postID).collection('comments');
    const allComments = [];
    return commentsRef.orderBy('time').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            allComments.push(formatData(doc));
        });
        return allComments;
    });
}

function getPost(postID) {
    const postRef = postsRef.doc(postID);
    return postRef.get().then((ref) => {
        if (ref.exists) {
            return formatData(ref);
        }
        throw new Error(`Bad request: No post with ID ${postID}`);
    });
}

function getPostAndComments(postID) {
    return getPost(postID)
        .then((post) => getComments(postID).then((comments) => Object.assign(post, { comments })));
}

function addComment(postId, commentRequest) {
    if (!(postId && commentRequest.comment && commentRequest.user)) return Promise.reject(new ValidationError('Object requires comment and user'));

    return getPost(postId).then(() => {
        const commentsRef = postsRef.doc(postId).collection('comments');
        const commentData = (({ comment, user }) => ({ comment, user, time: new Date() }))(commentRequest);
        return commentsRef.add(commentData).then((ref) => Object.assign(commentData, { id: ref.id }));
    });
}

module.exports = {
    getAllPosts, addPost, getPostAndComments, addComment,
};
