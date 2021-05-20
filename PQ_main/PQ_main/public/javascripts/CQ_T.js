//_ => ~ => -
{
	// <script src="jspsych-6.3.0/plugins/jspsych-rdk.js"></script>
	// <script src="jspsych-6.3.0/plugins/jspsych-html-keyboard-response.js"></script>
}
class T {
	constructor(isExercise) {
		this._one = '';
		this._all = '';
		this._tmpAll = {
			Count: 0,
			Speed: 0,
			Level: 0,
			Score: 0,
		};
		this._mode = isExercise;
		this._questionsNum = 20;
		this._questionType = {
			TEN: 0,
			DOT_W: 1,
			DOT_A: 2,
			DOT_S: 3,
			DOT_D: 4,
			WHITE: 5,
		};
		this._ballVelocityType = {
			slow: 1,
			middle: 2,
			fast: 3,
		};
		this._setting = {
			ballCount: 0,
			ballVelocity: 0,
		};
		this._DIRECTION = {
			LEFT: 180,
			RIGHT: 0,
			UP: 90,
			DOWN: 270,
		};

		this._difficulty = {
			1: 0.5,
			2: 0.4,
			3: 0.3,
			4: 0.2,
			5: 0.1,
			6: 0.05,
		};

		const TYPE = this._questionType;
		const DIRECTION = this._DIRECTION;
		this._translateTable = {};
		this._translateTable[TYPE.DOT_W] = 'w';
		this._translateTable[TYPE.DOT_A] = 'a';
		this._translateTable[TYPE.DOT_S] = 's';
		this._translateTable[TYPE.DOT_D] = 'd';
		this._translateDirTable = {};
		this._translateDirTable[TYPE.DOT_W] = DIRECTION.UP;
		this._translateDirTable[TYPE.DOT_A] = DIRECTION.LEFT;
		this._translateDirTable[TYPE.DOT_S] = DIRECTION.DOWN;
		this._translateDirTable[TYPE.DOT_D] = DIRECTION.RIGHT;
	}
	_start(level) {
		const randomInt = (min, max) =>
			Math.floor((max + 1 - min) * Math.random()) + min;
		const { _questionType: TYPE, _questionsNum: questionsNum } = this;
		let questions = [];
		for (let i = 0; i < questionsNum; i++) {
			questions.push(TYPE.TEN);
			questions.push(randomInt(TYPE.DOT_W, TYPE.DOT_D));
			questions.push(TYPE.WHITE);
		}
		return questions;
	}

	_level(level, questions) {
		const { _questionType: TYPE } = this;

		let timeline = [];
		questions.map((value, index) => {
			switch (value) {
				case TYPE.TEN:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus:
							"<p style='font-size: 30px; font-weight: bold; color: black'>+</p>",
						choices: jsPsych.NO_KEYS,
						trial_duration: 1000,
					});
					break;
				case TYPE.DOT_W:
				case TYPE.DOT_A:
				case TYPE.DOT_S:
				case TYPE.DOT_D:
					const {
						_setting: { ballCount, ballVelocity },
						_translateTable: translateTable,
						_translateDirTable: translateDirTable,
						_difficulty: difficulty,
					} = this;

					timeline.push({
						type: 'rdk',
						post_trial_gap: 0,
						number_of_dots: ballCount,
						RDK_type: 3,
						choices: ['w', 'a', 's', 'd'],
						correct_choice: translateTable[value.toString()],
						coherent_direction: translateDirTable[value.toString()],
						coherence: difficulty[level],
						move_distance: ballVelocity,
						dot_color: 'blue',
						background_color: 'white',
						response_ends_trial: false,
						dot_radius: 5,
						aperture_width: 700,
						reinsert_type: 1,
						aperture_type: 1,
						trial_duration: 500,
					});
					break;
				case TYPE.WHITE:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: '',
						choices: ['w', 'a', 's', 'd'],
						trial_duration: 1000,
					});
					break;
			}
		});

		return timeline;
	}

	_round(level) {
		const questions = this._start(level);
		const timeline = this._level(level, questions);
		console.log(timeline);
		this._tmpAll.Level = level;
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: timeline,
				on_trial_start: () => {},
				on_trial_finish: () => {},
				on_finish: () => {
					const {
						_questionType: TYPE,
						_setting: { ballCount, ballVelocity },
						_difficulty: difficulty,
					} = this;
					const data = JSON.parse(jsPsych.data.get().json());
					console.log(data);
					let lastDir = 0;
					let localScore = 0;
					if (level > 1) this._one += '-';
					data.map((val, index) => {
						switch (questions[index]) {
							case TYPE.TEN:
								if (index > 0) this._one += '~';
								this._one += `${ballCount}_${ballVelocity}_${difficulty[level]}_`;
								break;
							case TYPE.DOT_W:
								this._one += `4_`;
								lastDir = 4;
								break;
							case TYPE.DOT_A:
								this._one += `3_`;
								lastDir = 3;
								break;
							case TYPE.DOT_S:
								this._one += `2_`;
								lastDir = 2;
								break;
							case TYPE.DOT_D:
								this._one += `1_`;
								lastDir = 1;
								break;
							case TYPE.WHITE:
								const translateTable = {
									w: 4,
									a: 3,
									s: 2,
									d: 1,
								};
								const correct = lastDir == translateTable[val.response] ? 1 : 0;
								this._tmpAll.Score += correct;
								localScore += correct;
								const rt = val.rt != null ? Math.floor(val.rt) : 'NS';
								this._one += `${
									translateTable[val.response] || 'NS'
								}_${correct}_${rt}`;
								break;
						}
					});
					resolve(localScore / this._questionsNum > 0.8);
				},
			});
		});
	}
	_listener() {}

	_chooseMode() {
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: [
					{
						type: 'html-keyboard-response',
						stimulus:
							"<h1>請選擇您想要的小圓點數量</h1><h3>100顆按鍵盤'1'</h3><h3>200顆按鍵盤'2'</h3><h3>300顆按鍵盤'3'</h3><h3>400顆按鍵盤'4'</h3><h3>500顆按鍵盤'5'</h3><h3>600顆按鍵盤'6'</h3><h3>700顆按鍵盤'7'</h3><h3>800顆按鍵盤'8'</h3><h3>900顆按鍵盤'9'</h3><h3>1000顆按鍵盤'0'</h3>",
						choices: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
					},
					{
						type: 'html-keyboard-response',
						stimulus:
							"<h1>請選擇您想要的速度</h1><h3>慢速按鍵盤'S'</h3><h3>普通按鍵盤'M'</h3><h3>快速按鍵盤'F'</h3>",
						choices: ['s', 'm', 'f'],
					},
				],
				on_finish: () => {
					const data = JSON.parse(jsPsych.data.get().json());
					console.log(data);
					const ballCountTable = {
						1: 100,
						2: 200,
						3: 300,
						4: 400,
						5: 500,
						6: 600,
						7: 700,
						8: 800,
						9: 900,
						0: 1000,
					};
					const { _ballVelocityType: TYPE } = this;
					const ballVelocityTable = {
						s: TYPE.slow,
						m: TYPE.middle,
						f: TYPE.fast,
					};
					this._setting.ballCount = ballCountTable[data[0].response];
					this._setting.ballVelocity = ballVelocityTable[data[1].response];
					this._tmpAll.Count = this._setting.ballCount;
					this._tmpAll.Speed = this._setting.ballVelocity;
					resolve('end');
				},
			});
		});
	}

	async process() {
		await this._chooseMode();
		this._listener();
		let level = 1; //從level 1開始
		let isNext;
		do {
			isNext = await this._round(level++);
		} while (isNext);
		const { Count, Speed, Score, Level } = this._tmpAll;
		this._all = `${Count}_${Speed}_${Level}_${Score}`;
		if (this._mode) return { one: this._one, all: this._all };
		return { one: this._one, all: this._all };
	}
}
