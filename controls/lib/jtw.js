const jwt = require('jsonwebtoken');

require('dotenv').config()

const JWT_SECRET  = process.env.JWT_SECRET

exports.encryptToJWT = (value) => {
	const token = jwt.sign({ value }, JWT_SECRET);
	return token;
}

exports.decryptJWT = (jsonWebToken) => {
	const { value }  = jwt.verify(jsonWebToken, JWT_SECRET);
	return value;
}
