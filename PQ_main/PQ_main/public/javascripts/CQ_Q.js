//_ => ~ => -
{
	/* <script src="/jspsych-6.3.0/plugins/jspsych-html-keyboard-response.js"></script> */
}
class Q {
	constructor(isExercise) {
		this._one = '';
		this._all = '';
		this._tmpAll = {
			difficulty: 1,
			finalLevel: 1,
			Acc: 0,
			score: 0,
			score1: 0,
			score2: 0,
		};
		this._mode = isExercise;
		this._questionsNum = 30;
		this._questionType = {
			TEN: 0,
			WHITE_TABLE: 1,
			WHITE_TABLE_SAMPLE: 2,
			ANIMAL_PUSH: 3,
			ANIMAL_WAIT: 4,
		};
		this._difficulty_TYPE = {
			EASY: 2,
			MEDIUM: 3,
			DIFFICULT: 4,
		};
		this._difficulty = this._difficulty_TYPE.EASY;
		this._totalScore = 0;
		this._lock = false;
	}
	_start(level) {
		const { _questionType: TYPE, _questionsNum: questionsNum } = this;
		let questions = [];
		questions.push(TYPE.TEN);
		questions.push(TYPE.WHITE_TABLE_SAMPLE);
		for (let i = 0; i < level; i++) {
			questions.push(TYPE.ANIMAL_WAIT);
			questions.push(TYPE.WHITE_TABLE_SAMPLE);
		}

		let animalQuestions = [];
		const animalBase = [TYPE.ANIMAL_PUSH, TYPE.ANIMAL_WAIT, TYPE.ANIMAL_WAIT];
		while (animalQuestions.length < questionsNum)
			animalQuestions = animalQuestions.concat(animalBase);
		animalQuestions = animalQuestions.sort(() => 0.5 - Math.random());
		animalQuestions.map((value) => {
			questions.push(value);
			questions.push(TYPE.WHITE_TABLE);
		});

		return questions;
	}

	_level(level, questions) {
		const { _questionType: TYPE, _difficulty: tableLength } = this;
		const createTable = (
			{ row: row = -1, col: col = -1, path: path = '' },
			id
		) => {
			let eachTr = [];
			for (let i = 0; i < tableLength; i++) {
				let tds = '';
				for (let j = 0; j < tableLength; j++) {
					if (i == row && j == col) {
						tds += `<td><img src='${path}'></img></td>`;
						continue;
					}
					tds += '<td></td>';
				}
				eachTr.push(`<tr>${tds}</tr>`);
			}
			const trs = eachTr.reduce((pre, cur) => {
				return pre + cur;
			}, '');
			const tableId = id || 'sample';
			const table = `<label id="score"><br></label><table id="${tableId}">${trs}</table>`;
			return table;
		};
		const generateRandomInt = (min, max) =>
			Math.floor(Math.random() * (max + 1 - min) + min);
		let timeline = [];
		let animalList = [];
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
				case TYPE.WHITE_TABLE_SAMPLE:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: createTable({}),
						choices: jsPsych.NO_KEYS,
						trial_duration: 1000,
					});
					break;
				case TYPE.WHITE_TABLE:
					let tableName = 'sample';
					if (questions[index - 1] == TYPE.ANIMAL_PUSH) tableName = 'push';
					else if (questions[index - 1] == TYPE.ANIMAL_WAIT) tableName = 'wait';
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: createTable({}, tableName),
						choices: ['j'],
						trial_duration: 1250,
						response_ends_trial: false,
					});
					break;
				case TYPE.ANIMAL_PUSH:
					const shouldSame = animalList[animalList.length - level];
					animalList.push({
						row: shouldSame.row,
						col: shouldSame.col,
						path: `/image/CQ_Q_animal/${generateRandomInt(1, 5)}.jpg`,
					});
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: createTable(animalList[animalList.length - 1]),
						choices: jsPsych.NO_KEYS,
						trial_duration: 250,
					});
					break;
				case TYPE.ANIMAL_WAIT:
					if (animalList.length - level < 0) {
						animalList.push({
							row: generateRandomInt(0, tableLength - 1),
							col: generateRandomInt(0, tableLength - 1),
							path: `/image/CQ_Q_animal/${generateRandomInt(1, 5)}.jpg`,
						});
					} else {
						const shouldNotSame = animalList[animalList.length - level];
						const oldRow = shouldNotSame.row,
							oldCol = shouldNotSame.col;
						while (true) {
							const newRow = generateRandomInt(0, tableLength - 1);
							const newCol = generateRandomInt(0, tableLength - 1);
							if (newRow == oldRow && newCol == oldCol) continue;
							animalList.push({
								row: newRow,
								col: newCol,
								path: `/image/CQ_Q_animal/${generateRandomInt(1, 5)}.jpg`,
							});
							break;
						}
					}
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: createTable(animalList[animalList.length - 1]),
						choices: jsPsych.NO_KEYS,
						trial_duration: 250,
					});
					break;
			}
		});
		this._animalList = animalList;
		return timeline;
	}

	_round(level) {
		const questions = this._start(level);
		const timeline = this._level(level, questions);
		console.log(timeline);
		this._tmpAll.finalLevel = level;
		if (level > 1) this._one += '-';
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: timeline,
				on_trial_start: () => {
					setTimeout(() => {
						const score = document.getElementById('score');
						const wait = document.getElementById('wait');
						const push = document.getElementById('push');
						if (score != null) {
							score.innerHTML = this._totalScore;
						}
						if (wait != null) {
							this._lock = true;
							++this._totalScore;
						}
						if (push != null) {
							this._lock = true;
						}
					}, 1);
				},
				on_trial_finish: () => {},
				on_finish: () => {
					const {
						_questionType: TYPE,
						_difficulty: difficulty,
						_animalList: animalList,
					} = this;
					const data = JSON.parse(jsPsych.data.get().json());
					console.log(data);
					let animalIndex = 0;
					data.map((value, index) => {
						switch (questions[index]) {
							case TYPE.TEN:
								break;
							case TYPE.WHITE_TABLE:
								this._one += value.response == null ? '0_' : '1_';
								if (
									value.response == null &&
									questions[index - 1] == TYPE.ANIMAL_WAIT
								)
									this._one += '1';
								else if (
									value.response == 'j' &&
									questions[index - 1] == TYPE.ANIMAL_PUSH
								)
									this._one += '1';
								else this._one += '0';
								break;
							case TYPE.WHITE_TABLE_SAMPLE:
								if (questions[index - 1] == TYPE.ANIMAL_WAIT)
									this._one += 'NA_NA';
								break;
							case TYPE.ANIMAL_PUSH:
								if (animalIndex > 0) this._one += '~';
								this._one += `${difficulty - 1}_${level}_x${
									animalList[animalIndex].row
								}y${animalList[animalIndex].col}_1_`;
								animalIndex++;
								break;
							case TYPE.ANIMAL_WAIT:
								if (animalIndex > 0) this._one += '~';
								this._one += `${difficulty - 1}_${level}_x${
									animalList[animalIndex].row
								}y${animalList[animalIndex].col}_0_`;
								animalIndex++;
								break;
						}
					});
					const thisLevelScore = this._totalScore - this._tmpAll.score;
					const localAcc = thisLevelScore / this._questionsNum;
					if (level == 1) this._tmpAll.score1 = thisLevelScore;
					else if (level == 2) this._tmpAll.score2 = thisLevelScore;
					this._tmpAll.score = this._totalScore;
					resolve(localAcc > 0.8);
				},
			});
		});
	}
	_listener() {
		document.addEventListener('keydown', (e) => {
			const wait = document.getElementById('wait');
			const push = document.getElementById('push');

			if (e.keyCode == 74 && wait != null && this._lock) {
				this._lock = false;
				this._totalScore--;
				return;
			}
			if (e.keyCode == 74 && push != null && this._lock) {
				this._lock = false;
				this._totalScore++;
				return;
			}
			return;
		});
	}

	_chooseMode() {
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: [
					{
						type: 'html-keyboard-response',
						stimulus:
							"<h1>請選擇您想要的難度</h1><h3>簡單按鍵盤'E'</h3><h3>普通按鍵盤'M'</h3><h3>困難按鍵盤'D'</h3>",
						choices: ['e', 'm', 'd'],
					},
				],
				on_finish: () => {
					const data = JSON.parse(jsPsych.data.get().json());
					console.log(data);
					const translate = {
						e: 'EASY',
						m: 'MEDIUM',
						d: 'DIFFICULT',
					};
					this._difficulty = this._difficulty_TYPE[translate[data[0].response]];
					this._tmpAll.difficulty = this._difficulty;
					resolve(this._difficulty);
				},
			});
		});
	}

	async process() {
		await this._chooseMode();
		this._listener();
		let level = 1; //從level 1開始
		while (true) {
			const isNext = await this._round(level++);
			if (!isNext) break;
		}
		this._tmpAll.Acc =
			(this._tmpAll.score / (this._tmpAll.finalLevel * this._questionsNum)) *
			100;
		const {
			_tmpAll: { difficulty, finalLevel, Acc, score, score1, score2 },
		} = this;
		this._all += `${
			difficulty - 1
		}_${finalLevel}_${Acc}_${score}_${score1}_${score2}`;
		if (this._mode) return { one: this._one, all: this._all };
		return { one: this._one, all: this._all };
	}
}
