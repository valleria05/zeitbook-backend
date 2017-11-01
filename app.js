
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://zeitspace-forum.firebaseio.com"
});

var db = admin.database();
var ref = db.ref();
var postsRef = ref.child("posts");

ref.once("value", function(snapshot) {
    console.log(snapshot.val());
});
