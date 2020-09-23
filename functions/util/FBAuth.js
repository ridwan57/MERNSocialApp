const { admin, db } = require('../util/admin');
exports.FBAuth = (req, res, next) => {
	let idToken;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
		idToken = req.headers.authorization.split('Bearer ')[1];
	} else {
		res.status(403).json({ error: 'Unauthorized' });
	}
	admin
		.auth()
		.verifyIdToken(idToken)
		.then((decodedToken) => {
			req.user = decodedToken;
			return db.collection('users').where('userId', '==', req.user.uid).limit(1).get();
		})
		.then((data) => {
			req.user.handle = data.docs[0].data().handle;
			return next();
		})
		.catch((err) => {
			res.status(403).json({ error: 'Error while verifying token' });
			console.error(err);
		});
};