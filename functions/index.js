const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const app = express();

admin.initializeApp();

const firebaseConfig = {
  apiKey: "AIzaSyA0SSBg8sKX3p-g0ilzj8ng0NEPBsfUfeY",
  authDomain: "gras-social.firebaseapp.com",
  databaseURL: "https://gras-social.firebaseio.com",
  projectId: "gras-social",
  storageBucket: "gras-social.appspot.com",
  messagingSenderId: "895600116066",
  appId: "1:895600116066:web:8716397b0a1c6877082c3b",
  measurementId: "G-NBTW3KBNVC",
};

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);
const db = admin.firestore();

app.get("/screams", (req, res) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screams = [];

      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(screams);
    })
    .catch((err) => console.error(err));
});

app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
  };

  db.collection("screams")
    .add(newScream)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created sucessfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "Something went wrong" });
      console.error(err);
    });
});

//Signup route
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  //TODO validate data
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: "this handle already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email already exist" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

exports.api = functions.region("asia-southeast2").https.onRequest(app);
