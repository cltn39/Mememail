
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCbUttw5Gb8hp9ZMzb77V26P3_cSgbDnDc",
  authDomain: "test-b2de3.firebaseapp.com",
  databaseURL: "https://test-b2de3.firebaseio.com",
  projectId: "test-b2de3",
  storageBucket: "test-b2de3.appspot.com",
  messagingSenderId: "655227369754",
  appId: "1:655227369754:web:5e4074b3907f60a2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.database();
var initialValue = 0;
var mailCounter = initialValue;

db.ref().on("value", function (snapshot) {

  console.log(snapshot.val());
  mailCounter = snapshot.val().mailCount;
  console.log(mailCounter);
  $("#mailSentValue").text(mailCounter);

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

$(".sendButton").on("click", function () {
  mailCounter++;
  console.log(mailCounter);
  // Save new value to Firebase
  db.ref().set({
    clickCount: mailCounter
  });
  console.log(mailCounter);
});