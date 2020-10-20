const functions = require("firebase-functions");
const express = require("express");
const app = express();

const FBAuth = require("./util/fbAuth");

const { getAllScreams, postOneScream } = require("./handlers/screams");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
} = require("./handlers/users");

//SCREAMS ROUTES
app.get("/screams", getAllScreams);
app.post("/scream", FBAuth, postOneScream);

//USERS ROUTES
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
// app.get("/user/:handle", getUserDetails);

exports.api = functions.region("asia-southeast2").https.onRequest(app);
