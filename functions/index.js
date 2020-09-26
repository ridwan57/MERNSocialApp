const functions = require('firebase-functions');

const app = require('express')();

const { fbAuth } = require('./util/fbAuth');

const { getAllScreams, postOneScream } = require('./handlers/screams');

const { signup, login, uploadImage } = require('./handlers/users');

//Scream route
app.get('/screams', getAllScreams);
app.post('/scream', fbAuth, postOneScream);

//User Route
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', fbAuth, uploadImage);
exports.api = functions.https.onRequest(app);
