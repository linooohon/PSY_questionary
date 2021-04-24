require('dotenv').config();

function Get(thing) {
	switch (thing) {
		// case 'mongoPath':
		// 	return 'mongodb://localhost:27017/';
		case 'mongoPath':
			return process.env.mongoPath;
		//case "QQ/EQ":
		//    return 'https://leon123858.github.io/questionareSystem/UCS/confirm.html';
		case 'SRSurl':
			return process.env.SRSurl;
		default:
			return '';
	}
}

module.exports.Get = Get;
