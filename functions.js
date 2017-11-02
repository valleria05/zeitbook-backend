var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

var db = admin.firestore();
var postsRef = db.collection('posts');

function getAllPosts() {
    var allPosts = [];
    return postsRef.get().then(snapshot => {
        snapshot.forEach(doc => {
            let data = doc.data();
            delete data.comments;
            allPosts.push(Object.assign(data, { id: doc.id }));
        });
        return allPosts;
    })
    .catch(err => {
        console.log(err);
    });
};

module.exports = {getAllPosts};
