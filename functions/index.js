const functions = require('firebase-functions');

const app = require('express')();

const { FBAuth } = require('./util/FBAuth');

const { getAllScreams, postOneScream } = require('./handlers/screams');

const { signup, login, uploadImage } = require('./handlers/users');

//Scream route
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);

//User Route
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', uploadImage);
exports.api = functions.https.onRequest(app);
