var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
var ValidationError = require("./ValidationError");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

var db = admin.firestore();
var postsRef = db.collection('posts');

function formatData(doc) {
    if (doc.data()) {
        return Object.assign(doc.data(), { id: doc.id } );
    } else {
        return;
    }
}

function getAllPosts() {
    var allPosts = [];
    return postsRef.orderBy('time').get().then(snapshot => {
        snapshot.forEach(doc => {
            let data = doc.data();
            delete data.comments;
            allPosts.push(Object.assign(data, { id: doc.id }));
        });
        return allPosts;
    })
    .catch(err => {
        throw new Error(err);
    });
};

function addPost(postData) {
    if (postData.title && postData.content && postData.user) {
        const {title, content, user, time = new Date()} = postData;
        return postsRef.add({title, content, user, time}).then(ref => {
            return Object.assign({title, content, user, time}, { id: ref.id });
        });
    } else {
        throw new Error("Object requires title, content and user");
    }
};

function getComments(postID) {
    const commentsRef = postsRef.doc(postID).collection("comments");
    var allComments = [];
    return commentsRef.orderBy('time').get().then(snapshot => {
        snapshot.forEach(doc => {
            allComments.push(formatData(doc));
        });
        return allComments;
    });
}

function getPost(postID) {
    const postRef = postsRef.doc(postID);
    return postRef.get().then(ref => {
        if (ref.exists) {
            return formatData(ref);
        } else {
            throw new Error("Bad request: No post with ID " + postID);
        }
    });
}

function getPostAndComments(postID) {
    return getPost(postID)
    .then(post => {
        return getComments(postID).then(comments => {
            return Object.assign(post, { comments });
        });
    })
}

function addComment(postId, comment) {
    if (!(postId && comment.comment && comment.user)) return Promise.reject(new ValidationError("Object requires comment and user"));

    return getPost(postId).then((post) => {
        commentsRef = postsRef.doc(postId).collection("comments");
        const commentData = (({ comment, user }) => ({ comment, user, time: new Date() }))(comment);
        return commentsRef.add(commentData).then(ref => {
            return Object.assign(commentData, { id: ref.id });
        });
    });
};

module.exports = { getAllPosts, addPost, getPostAndComments, addComment };
