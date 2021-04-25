'use strict';
const cuid = require('cuid');
var express = require('express');
var router = express.Router();
const { Get } = require('./GetConst');
var MongoClient = require('mongodb').MongoClient;
const jumpBoard_license = ['EW3', 'EW4', 'EW5'];
//mail
const nodemailer = require('nodemailer');
const mailTransport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		// 要用來發信的帳號及密碼，後面可以改用 dotenv 來傳入，進而保護自己的帳密
		user: Get('Gmail_ID'),
		pass: Get('Gmail_password'),
	},
});
const sendMailer = Get('sendMailer');
const local_uri = Get('local_uri');
/**********************
 ./EW
 ***********************/
router.get('/', function (req, res) {
	res.render('EW/EW1');
});
/**********************
 ./EW/login
 1.抓帳密和是否第一次
 2.不存在警告 不存在此帳號, 密碼不配對警告 密碼不配對,後傳是否第一次
 3.第一次->改為不是第一次 渲染至EW2
 4.非第一次->抓取過去資料進入EW4
 ***********************/
function logincheckID(db, ID, password) {
	return new Promise((resolve, reject) => {
		var table = db.db('EW').collection('personal_information');
		table.findOne(
			{ ID: ID },
			{ projection: { _id: 0 } },
			function (err, result) {
				if (err) {
					reject({ message: '伺服器連線錯誤' });
					throw err;
				}
				if (result == null) reject({ message: '不存在此帳號' });
				else if (result.password == password)
					result.first
						? resolve({ walk: 'first' })
						: resolve({ walk: 'Notfirst' });
				else reject({ message: '密碼錯誤' });
			}
		);
	});
}
function loginFirstRender(db, res, ID, password) {
	return new Promise((resolve, reject) => {
		var table = db.db('EW').collection('personal_information');
		table.updateOne(
			{ ID: ID },
			{ $set: { first: false } },
			function (err, result) {
				if (err) {
					reject({ message: '伺服器連線錯誤' });
					throw err;
				}
				res.render('EW/EW2', { ID: ID, password: password });
				resolve({});
			}
		);
	});
}
function loginNotFirstRender(db, res, ID, password) {
	return new Promise((resolve, reject) => {
		var table = db.db('EW').collection('personal_data');
		table.findOne(
			{ ID: ID },
			{ projection: { _id: 0 } },
			function (err, result) {
				if (err) {
					reject({ message: '伺服器連線錯誤' });
					throw err;
				}
				if (result != null) {
					res.render('EW/EW4', {
						ID: ID,
						password: password,
						data: JSON.stringify(result),
					});
					//console.log({ ID: ID, password: password, data: JSON.stringify(result) });
				} else res.render('EW/EW2', { ID: ID, password: password });
				resolve({});
			}
		);
	});
}

router.post('/login', function (req, res) {
	var ID = req.body.ID;
	var password = req.body.password;
	MongoClient.connect(
		Get('mongoPath') + 'EW',
		{ useNewUrlParser: true, useUnifiedTopology: true },
		function (err, db) {
			if (err) {
				res.render('warming', { message: '伺服器連線錯誤' });
				throw err;
			}
			logincheckID(db, ID, password)
				.then((pkg) => {
					if (pkg.walk == 'first')
						loginFirstRender(db, res, ID, password)
							.catch((error) => res.render('warming', error))
							.finally((pkg) => db.close());
					else
						loginNotFirstRender(db, res, ID, password)
							.catch((error) => res.render('warming', error))
							.finally((pkg) => db.close());
				})
				.catch((error) => res.render('warming', error));
		}
	);
});
/**********************
 ./EW/jumpBoard
 1.查看跳轉頁是否許可
 2.看存在與密碼對不對
 3.跳轉
 ***********************/
function jumpBoardCheckPassword(db, ID, password) {
	return new Promise((resolve, reject) => {
		var table = db.db('EW').collection('personal_information');
		table.findOne(
			{ ID: ID },
			{ projection: { _id: 0 } },
			function (err, result) {
				if (err) {
					reject({ message: '伺服器連線錯誤' });
					throw err;
				}
				if (result == null) reject({ message: '不存在此帳號' });
				else if (result.password == password)
					resolve({ ID: ID, password: password, data: 'NA' });
				else reject({ message: '密碼錯誤' });
			}
		);
	});
}
router.post('/jumpBoard', function (req, res) {
	//上面有設jumpBoard_license
	var ID = req.body.ID;
	var password = req.body.password;
	var goal = req.body.goal;
	if (jumpBoard_license.indexOf(goal) > -1)
		MongoClient.connect(
			Get('mongoPath') + 'EW',
			{ useNewUrlParser: true, useUnifiedTopology: true },
			function (err, db) {
				if (err) {
					res.render('warming', { message: '伺服器連線錯誤' });
					throw err;
				}
				jumpBoardCheckPassword(db, ID, password)
					.then((pkg) => res.render('EW/' + goal, pkg))
					.catch((error) => res.render('warming', error))
					.finally((pkg) => db.close());
			}
		);
	else res.render('warming', { message: '非法操作, 請聯絡網站管理員' });
});

/**********************
 ./EW/changePassword(AJAX)
 1.確認帳密
 2.更新密碼
 ***********************/
function changePasswordCheckPassword(db, ID, password) {
	return new Promise((resolve, reject) => {
		var table = db.db('EW').collection('personal_information');
		table.findOne(
			{ ID: ID },
			{ projection: { _id: 0 } },
			function (err, result) {
				if (err) {
					reject({ result: '伺服器連線錯誤' });
					throw err;
				}
				if (result == null) reject({ result: '不存在此帳號' });
				else if (result.password == password) resolve(1);
				else reject({ result: '密碼錯誤' });
			}
		);
	});
}
function changePasswordUpdatePassword(db, ID, new_password) {
	return new Promise((resolve, reject) => {
		var table = db.db('EW').collection('personal_information');
		table.updateOne(
			{ ID: ID },
			{ $set: { password: new_password } },
			function (err, result) {
				if (err) {
					reject({ result: '伺服器連線錯誤' });
					throw err;
				}
				resolve({ result: 'success' });
			}
		);
	});
}
router.post('/changePassword', function (req, res) {
	var ID = req.body.ID;
	var password = req.body.password;
	var new_password = req.body.new_password;
	MongoClient.connect(
		Get('mongoPath') + 'EW',
		{ useNewUrlParser: true, useUnifiedTopology: true },
		function (err, db) {
			if (err) {
				res.json({ result: '伺服器連線錯誤' });
				throw err;
			}
			changePasswordCheckPassword(db, ID, password)
				.then((pkg) => changePasswordUpdatePassword(db, ID, new_password))
				.then((pkg) => res.json(pkg))
				.catch((error) => res.json(error))
				.finally((pkg) => db.close());
		}
	);
});
/**********************
 ./EW/updateData(AJAX)
 1.查看存在帳號密碼
 2.更新(upsert:true)
 ***********************/

function updateDataUpdate(db, ID, data) {
	return new Promise((resolve, reject) => {
		var table = db.db('EW').collection('personal_data');
		var goal = { ID: ID };
		try {
			data.split('_').forEach((item) => {
				let json = item.split('~');
				goal[json[0]] = json[1];
			});
		} catch (e) {
			reject({ result: '傳遞格式錯誤' });
			throw e;
		}
		table.updateOne(
			{ ID: ID },
			{ $set: goal },
			{ upsert: true },
			function (err, result) {
				if (err) {
					reject({ result: '伺服器連線錯誤' });
					throw err;
				}
				resolve({ result: 'success' });
			}
		);
	});
}

router.post('/updateData', function (req, res) {
	var ID = req.body.ID;
	var password = req.body.password;
	var data = req.body.data;
	MongoClient.connect(
		Get('mongoPath') + 'EW',
		{ useNewUrlParser: true, useUnifiedTopology: true },
		function (err, db) {
			if (err) {
				res.json({ result: '伺服器連線錯誤' });
				throw err;
			}
			//此處因功能相同, 續用前一個API的function
			changePasswordCheckPassword(db, ID, password)
				.then((pkg) => updateDataUpdate(db, ID, data))
				.then((pkg) => res.json(pkg))
				.catch((error) => res.json(error))
				.finally((pkg) => db.close());
		}
	);
});

/**********************
 ./EW/register
 檢查email是否存在,若尚未激發 重寄, 寄送驗證信(含驗證信箱連結)至信箱
 ***********************/

const ifEmailExistAndActivity = (db, email) => {
	const table = db.db('EW').collection('personal_register');
	const goal = { email: email };
	return new Promise((resolve, reject) => {
		table.findOne(goal, (err, result) => {
			if (err) {
				reject({ result: '伺服器連線錯誤' });
				return;
			}
			result == null
				? resolve({ exist: false, activity: false })
				: resolve({ exist: true, activity: result.activity });
			return;
		});
	});
};

const saveToken = (db, email) => {
	const table = db.db('EW').collection('personal_register');
	const token = cuid();
	const goal = { token: token, email: email, activity: false };
	return new Promise((resolve, reject) => {
		table.updateOne(
			{ email: email },
			{ $set: goal },
			{ upsert: true },
			function (err, result) {
				if (err) {
					reject({ result: '伺服器連線錯誤' });
					return;
				}
				resolve({ result: 'success', token: token });
			}
		);
	});
};

const sendMail = (token, email) => {
	const URL = local_uri + '/EW/verification/' + token;
	// 設置發信內容
	const mailOtions = {
		form: sendMailer, // 發信者是誰
		to: email, // 發給誰，用逗號分開
		subject: '桌球運動員精準計畫 帳號啟用信', // 信件標題
		//text: 'XXXX', // 單純文字內容
		html:
			'<h1>親愛的使用者您好</h1><h2>我們是桌球運動員精準計畫, 若您想使用本平台, 可點擊下方連接, 會獲得您的實驗編號與臨時密碼。</h2>' +
			'<a href="' +
			URL +
			'">請點我(Click ME) [跳轉後即可看見您的實驗編號與臨時密碼]</a>', // 可寫入 HTML 格式
	};
	return new Promise((resolve, reject) => {
		mailTransport.sendMail(mailOtions, function (error, info) {
			if (error) {
				console.log(error.message);
				reject({ result: 'error' });
			}
			resolve({ result: 'success' });
		});
	});
};

router.post('/register', async function (req, res) {
	const email = req.body.email;
	MongoClient.connect(
		Get('mongoPath') + 'EW',
		{ useNewUrlParser: true, useUnifiedTopology: true },
		async function (err, db) {
			if (err) {
				res.json({ result: '伺服器連線錯誤' });
				throw err;
			}
			let situation;
			try {
				situation = await ifEmailExistAndActivity(db, email);
			} catch (err) {
				res.json({ result: 'success', message: '資料庫網路連接錯誤' });
				return;
			}
			if (situation.exist && situation.activity) {
				res.json({ result: 'success', message: '該信箱已被使用' });
				return;
			}
			const saveTokenResult = await saveToken(db, email);
			if (saveTokenResult.result != 'success') {
				res.json({ result: 'success', message: '資料庫網路連接錯誤' });
				return;
			}
			try {
				const sendMailResult = await sendMail(saveTokenResult.token, email);
				if (sendMailResult.result == 'success') {
					res.json({ result: 'success', message: '已成功寄出郵件' });
					return;
				}
				throw new Error('send err');
			} catch (err) {
				res.json({
					result: 'success',
					message: '信件無法寄出, 若確認信箱無誤, 請聯絡網站管理人',
				});
				return;
			}
		}
	);
});

/**********************
./EW/verification/:token 
 信箱驗證 => 點入連結, 若token符合則回傳新創建的帳號與密碼
 ***********************/

const ifTokenExistAndNotActivity = (token, db) => {
	const table = db.db('EW').collection('personal_register');
	const goal = { token: token };
	return new Promise((resolve, reject) => {
		table.findOne(goal, (err, result) => {
			if (err) {
				reject('伺服器連線錯誤');
				return;
			}
			result == null
				? reject('token not exist')
				: result.activity
				? reject('token have been activated')
				: resolve('exist and not activate');
			return;
		});
	});
};

const setActivity = (token, db) => {
	const table = db.db('EW').collection('personal_register');
	const filter = { token: token };
	const goal = { activity: true };
	return new Promise((resolve, reject) => {
		table.updateOne(filter, { $set: goal }, (err, result) => {
			if (err) {
				reject('伺服器連線錯誤');
				return;
			}
			resolve('success');
			return;
		});
	});
};

function FindAndUpdateUsersNumber(db) {
	return new Promise((resolve, reject) => {
		var table = db.db('lock').collection('users');
		var findThing = { name: 'usersCount' };
		var updateThing = { $inc: { count: 1 } };
		var set = { projection: { _id: 0 } };
		table.findOneAndUpdate(findThing, updateThing, set, function (err, result) {
			if (err) {
				reject('伺服器連線錯誤');
				throw err;
			}
			if (result.ok == 1) resolve({ result: result.value.count });
			else reject({ result: '系統錯誤,無法取得新使用者的編號' });
		});
	});
}

function randomString(digit) {
	var x = '0123456789qwertyuioplkjhgfdsazxcvbnm';
	var tmp = '';
	for (var i = 0; i < digit; i++)
		tmp += x.charAt(Math.floor(Math.random() * x.length));
	return tmp;
}

function InsertNewUser(db, pkg, tag) {
	return new Promise((resolve, reject) => {
		var new_ID = tag + '_' + pkg.result.toString();
		var random_password = randomString(8);
		var table = db.db('EW').collection('personal_information');
		table.insertOne(
			{ ID: new_ID, password: random_password, first: true },
			function (err, result) {
				if (err) {
					reject('伺服器連線錯誤');
					throw err;
				}
				db.close();
				resolve({ result: 'success', ID: new_ID, password: random_password });
			}
		);
	});
}

router.get('/verification/:token', async function (req, res) {
	const token = req.params.token;
	MongoClient.connect(
		Get('mongoPath') + 'EW',
		{ useNewUrlParser: true, useUnifiedTopology: true },
		async function (err, db) {
			if (err) {
				res.render('warming', { message: 'connect error with server' });
				throw err;
			}
			try {
				const situation = await ifTokenExistAndNotActivity(token, db);
				if (situation !== 'exist and not activate') {
					throw new Error('some thing wrong');
				}
				const setResult = await setActivity(token, db);
				if (setResult !== 'success') {
					throw new Error('some thing wrong');
				}
				const NumPkg = await FindAndUpdateUsersNumber(db);
				const InsertResult = await InsertNewUser(db, NumPkg, 'P');
				if (InsertResult.result !== 'success') {
					throw new Error('some thing wrong');
				}
				res.render('EW/register', {
					ID: InsertResult.ID,
					password: InsertResult.password,
					url: local_uri,
				});
			} catch (err) {
				console.log(err);
				res.render('warming', { message: err });
			}
			db.close();
			return;
		}
	);
});

module.exports = router;
