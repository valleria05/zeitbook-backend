var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

var db = admin.firestore();
var postsRef = db.collection('posts');

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
    if (postData.title && postData.content && postData.user) {
        const {title, content, user, time = new Date()} = postData;
        return postsRef.add({title, content, user, time}).then(ref => {
            return Object.assign({title, content, user, time}, { id: ref.id });
        });
    } else {
        throw new Error("Object requires title, content and user");
    }
};

module.exports = {getAllPosts, addPost};
