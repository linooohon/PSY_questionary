require('dotenv').config();

function Get(thing) {
	switch (thing) {
		// case "mongoPath":
		//     return 'mongodb://localhost:27017/';
		case 'mongoPath':
			return process.env.mongoPath;
		case 'ID':
			return process.env.ID;
		case 'password':
			return process.env.password;
		default:
			return '';
	}
}

module.exports.Get = Get;
