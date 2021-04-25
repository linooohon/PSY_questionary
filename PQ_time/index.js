//mail
const fetch = require('node-fetch');
const schedule = require('node-schedule');

console.log('start schedule');

// 定义规则
let rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 3;
rule.hour = 12;
rule.minute = 0;
rule.second = 0;
//rule.second = [0, 1, 2, 3, 10, 20, 30, 40, 50, 51, 52, 53];
// 启动任务
let job = schedule.scheduleJob(rule, () => {
	console.log(new Date());
	try {
		fetch('http://140.116.98.155:1339/?path=test.mp4').then((res) => {
			if (res.status == 200) {
				console.log('video: ' + res.status);
				fetch('http://127.0.0.1:1337/EW/mail').then((r) => {
					if (r.status == 200) {
						console.log('main: ' + r.status);
					} else {
						console.log('Wrong:' + r.status);
					}
				});
			} else {
				console.log('Wrong:' + res.status);
			}
		});
	} catch (err) {
		console.log('connect err');
	}
});
