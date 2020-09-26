const functions = require('firebase-functions');

const app = require('express')();

const { fbAuth } = require('./util/fbAuth');

const {
	getAllScreams,
	postOneScream,
	getScream,
	commentScream,
	likeScream,
	unlikeScream,
	deleteScream,
} = require('./handlers/screams');

const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users');

//Scream route
app.get('/screams', getAllScreams);
app.post('/scream', fbAuth, postOneScream);
app.get('/scream/:screamId', getScream);
app.post('/scream/:screamId/comment', fbAuth, commentScream);
app.post('/scream/:screamId/like', fbAuth, likeScream);
app.post('/scream/:screamId/unlike', fbAuth, unlikeScream);
app.post('/scream/:screamId/delete', fbAuth, deleteScream);

//User Route
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', fbAuth, uploadImage);
app.post('/user', fbAuth, addUserDetails);
app.get('/user', fbAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
