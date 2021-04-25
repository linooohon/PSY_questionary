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
		case 'Gmail_ID':
			return process.env.Gmail_ID;
		case 'Gmail_password':
			return process.env.Gmail_password;
		case 'sendMailer':
			return `使用者註冊信 <${process.env.Gmail_ID}>`;
		case 'local_uri':
			return process.env.local_uri;
		default:
			return '';
	}
}

module.exports.Get = Get;
