//_ => ~ => -
class A {
	constructor() {
		this._one = '';
		this._all = '';
		this._mode = '';
	}
	_start() {
		let timeline = [];
		let welcome = {
			type: 'html-keyboard-response',
			stimulus: 'Welcome to the experiment. Press any key to begin.',
		};
		var chooseMode = {
			type: 'html-keyboard-response',
			stimulus: `
    <p>please choose which mode you want</p>
    <p>press E is exercise mode</p>
    <p>press R is Real mode</p>
    <p>press Esc is exist this page</p>
  `,
			post_trial_gap: 2000,
			choices: ['e', 'r', 'Escape'],
		};
		timeline.push(welcome);
		timeline.push(chooseMode);
		return new Promise((resolve) =>
			jsPsych.init({
				timeline: timeline,
				on_finish: function () {
					let data = JSON.parse(jsPsych.data.get().json());
					console.log(data[1].response);
					switch (data[1].response) {
						case 'e':
							resolve('EASY');
							break;
						case 'r':
							resolve('REAL');
							break;
						default:
							window.history.go(-1);
							resolve();
							break;
					}
				},
			})
		);
	}
	_full_trail(stage) {
		let timeline = [];

		const randomNum = (min, max) => {
			return Math.floor(Math.random() * (max - min) + min);
		};

		const randomPlaceCSS = (basis, min, max) => {
			return `style="margin-left:${-basis + randomNum(min, max)}px;margin-top:${
				-basis + randomNum(min, max)
			}px"`;
		};

		const duration = (level) => {
			return 550 - level * 50;
		};

		const randomList = (arr) => {
			return arr.sort(function () {
				return 0.5 - Math.random();
			});
		};

		let questions = [];
		for (let i = 0; i < 14; i++) {
			questions[i] = '1';
		}
		for (let i = 14; i < 20; i++) {
			questions[i] = '2';
		}
		questions = randomList(questions);
		for (let i = 0; i < 20; i++) {
			let ten = {
				type: 'html-keyboard-response',
				stimulus:
					"<p style='font-size: 200px; font-weight: bold; color: black'>+</p>",
				choices: jsPsych.NO_KEYS,
				trial_duration: randomNum(200, 800),
			};
			timeline.push(ten);
			if (questions[i] == '1') {
				let fruit = {
					type: 'html-keyboard-response',
					stimulus:
						'<img src="/image/eye_L.jpg"' + randomPlaceCSS(500, 0, 1000) + '>',
					choices: ['j'],
					trial_duration: duration(stage),
					post_trial_gap: randomNum(150, 300),
				};
				timeline.push(fruit);
			} else {
				let bomb = {
					type: 'html-keyboard-response',
					stimulus:
						'<img src="/image/eye_R.jpg"' + randomPlaceCSS(500, 0, 1000) + '>',
					choices: ['j'],
					trial_duration: duration(stage),
					post_trial_gap: randomNum(150, 300),
				};
				timeline.push(bomb);
			}
		}
		console.log(timeline);
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: timeline,
				on_finish: function () {
					let inner_data = '';
					let data = JSON.parse(jsPsych.data.get().json());
					for (let i = 1; i < 40; i += 2) {
						inner_data += stage + '_' + questions[parseInt(i / 2)] + '_';
						if (
							(questions[parseInt(i / 2)] == '1' && data[i].response == 'j') ||
							(questions[parseInt(i / 2)] == '2' && data[i].response == null)
						)
							inner_data += '1_';
						else inner_data += '0_';
						inner_data += data[i].rt;
						if (i != 39) inner_data += '~';
					}
					console.log(data);
					resolve(inner_data);
				},
			});
		});
	}
	async process() {
		this._mode = await this._start();
		let stage = 1;
		while (stage < 3) {
			this._one += await this._full_trail(stage);
			++stage;
			if (stage != 2) this._one += '-';
		}
		this._all += 'ALL';
		return { one: this._one, all: this._all };
	}
}
