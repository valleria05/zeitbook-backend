var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

var db = admin.firestore();
var postsRef = db.collection('posts');

function formatResponse(obj) {
    return Object.assign(obj.data(), { id: obj.id });
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
        return err;
    });
};

function addPost(postData) {
    const {title, content, user, time = new Date()} = postData;
    return postsRef.add({title, content, user, time}).then(ref => {
        return Object.assign({title, content, user, time}, { id: ref.id });
    });
};

module.exports = {getAllPosts, addPost, formatResponse};
