var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

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
    const {title, content, user, time = new Date()} = postData;
    return postsRef.add({title, content, user, time}).then(ref => {
        return Object.assign({title, content, user, time}, { id: ref.id });
    });
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
            throw new Error("Post not found");
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

module.exports = {getAllPosts, addPost, getPostAndComments};
