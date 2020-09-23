const { db } = require('../util/admin');
const { config } = require('../util/config');
const { validateSignupData, validateLoginData } = require('../util/validators');

const firebase = require('firebase');
firebase.initializeApp(config);
let token, userId;
exports.signup = (req, res) => {
	const newUser = {
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
		handle: req.body.handle,
	};
	const { valid, errors } = validateSignupData(newUser);
	if (!valid) return res.status(400).json({ errors });
	db.doc(`/users/${newUser.handle}`)
		.get()
		.then((doc) => {
			if (doc.exists) {
				return res.status(400).json({ handle: 'this handle is already taken' });
			} else {
				return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
			}
		})
		.then((data) => {
			userId = data.user.uid;
			return data.user.getIdToken();
		})
		.then((idToken) => {
			token = idToken;
			const userCredentials = {
				email: newUser.email,
				handle: newUser.handle,
				createdAt: new Date().toISOString(),
				userId,
			};
			return db.doc(`/users/${newUser.handle}`).set(userCredentials);
			// return res.status(201).json({ token });
		})
		.then(() => {
			return res.status(201).json({ token });
		})
		.catch((err) => {
			console.error(err);
			if (err.code === 'auth/email-already-in-use') {
				return res.status(400).json({ email: 'Email is already Used' });
			} else {
				return res.status(500).json({ error: err.code });
			}
		});
};

exports.login = (req, res) => {
	const user = {
		email: req.body.email,
		password: req.body.password,
	};
	const { valid, errors } = validateLoginData(user);
	if (!valid) return res.status(400).json({ errors });
	firebase
		.auth()
		.signInWithEmailAndPassword(user.email, user.password)
		.then((data) => {
			return data.user.getIdToken();
		})
		.then((token) => {
			return res.json({ token });
		})
		.catch((err) => {
			if (err.code === 'auth/wrong-password') {
				res.status(500).json({ error: "Password doesn't Match" });
			} else if (err.code == 'auth/user-not-found') {
				res.status(500).json({ error: 'User not found' });
			} else res.status(500).json({ error: err.code });
			console.log(err);
		});
};
