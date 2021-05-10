//_ => ~ => -
const N_TYPE = {
	TEN: 0,
	CALCULATION_RIGHT: 1,
	CALCULATION_FAIL: 2,
	RANDOM_CHAR: 3,
	CHARS_LIST: 4,
};
class N {
	constructor(isExercise) {
		this._one = '';
		this._all = '';
		this._tmpAll = {
			finalLevel: 1,
			Num_Score: 0,
			Letter_Score: 0,
			Score: 0,
		};
		this._mode = isExercise;
		this._levelOffset = 2;
		this._questionsNum = 20;
	}
	_start(level) {
		//level1=>3組一題, 2=>4,......
		level += this._levelOffset;
		// randomize questions_array
		const randomList = (arr) => {
			return arr.sort(function () {
				return 0.5 - Math.random();
			});
		};

		const calculationResult = [
			N_TYPE.CALCULATION_RIGHT,
			N_TYPE.CALCULATION_FAIL,
		];
		let calculationResultList = [];
		for (let i = 0; i < level * (this._questionsNum / 2); i++)
			calculationResultList = calculationResultList.concat(calculationResult);
		calculationResultList = randomList(calculationResultList);

		let questions = [];
		let resultPoint = 0;
		for (let i = 0; i < this._questionsNum; i++) {
			let trail = [];
			trail.push(N_TYPE.TEN); //ten
			for (let j = 0; j < level; j++) {
				trail.push(calculationResultList[resultPoint++]); //calculation right
				trail.push(N_TYPE.RANDOM_CHAR); //calculation right
			}
			trail.push(N_TYPE.CHARS_LIST); //calculation right
			questions = questions.concat(trail);
		}

		return questions;
	}
	_level(level, questions) {
		const randomValue2Digit = () => parseInt(Math.random() * 100);
		const randomCalculateSol = (a, b, isAdd) => (isAdd ? a + b : a - b);
		const generateRandomInt = (min, max) =>
			Math.floor(Math.random() * (max - min) + min);
		const lowLine = (level) => {
			level += this._levelOffset;
			let str = '';
			for (let i = 0; i < level; i++) str += '_ ';
			return str;
		};
		let timeline = [];
		questions.map((value) => {
			switch (value) {
				case N_TYPE.TEN:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus:
							"<p style='font-size: 30px; font-weight: bold; color: black'>+</p>",
						choices: jsPsych.NO_KEYS,
						trial_duration: 1000,
					});
					break;
				case N_TYPE.CALCULATION_RIGHT:
					const firstNum = randomValue2Digit();
					const secondNum = randomValue2Digit();
					const isAdd = Math.random() > 0.5;
					const sol = randomCalculateSol(firstNum, secondNum, isAdd);
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: `<p>${firstNum} ${
							isAdd ? '+' : '-'
						} ${secondNum} = ${sol} </p>`,
						choices: ['j', 'f'],
						trial_duration: 1000,
					});
					break;
				case N_TYPE.CALCULATION_FAIL:
					const firstNumF = randomValue2Digit();
					const secondNumF = randomValue2Digit();
					const isAddF = Math.random() > 0.5;
					const fakeSol = randomValue2Digit();
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: `<p>${firstNumF} ${
							isAddF ? '+' : '-'
						} ${secondNumF} = ${fakeSol} </p>`,
						choices: ['j', 'f'],
						trial_duration: 1000,
					});
					break;
				case N_TYPE.RANDOM_CHAR:
					const char = String.fromCharCode(generateRandomInt(65, 91)); //65~90
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: `<h1>${char}</h1>`,
						choices: jsPsych.NO_KEYS,
						trial_duration: 1000,
					});
					break;
				case N_TYPE.CHARS_LIST:
					timeline.push({
						type: 'survey-html-form',
						html: `<label id="userInput">${lowLine(
							level
						)}</label><input id="userAns" name="response" value="" style="display:none" disable>`,
					});
					break;
			}
		});
		return timeline;
	}

	_round(level) {
		let timer;
		const questions = this._start(level);
		const timeline = this._level(level, questions);
		console.log(timeline);
		if (level > 1) this._one += '-';
		this._tmpAll.finalLevel = level;
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: timeline,
				on_trial_start: function () {
					timer = setTimeout(() => {
						const submit = document.getElementById(
							'jspsych-survey-html-form-next'
						);
						submit != null ? submit.click() : null;
					}, 30000);
				},
				on_trial_finish: function () {
					clearTimeout(timer);
				},
				on_finish: () => {
					const data = JSON.parse(jsPsych.data.get().json());
					console.log(data);
					let tmpCalculation = 0;
					let tmpChar = '';
					let questionNumber = 1;
					let score = 0;
					questions.map((val, index) => {
						const { response, stimulus } = data[index];
						switch (val) {
							case N_TYPE.TEN:
								this._one += `${level}_`;
								break;
							case N_TYPE.CALCULATION_RIGHT:
								tmpCalculation += response == 'j' ? 1 : 0;
								break;
							case N_TYPE.CALCULATION_FAIL:
								tmpCalculation += response == 'f' ? 1 : 0;
								break;
							case N_TYPE.RANDOM_CHAR:
								tmpChar += stimulus[4];
								break;
							case N_TYPE.CHARS_LIST:
								let rightChar = 0;
								for (let i = 0; i < tmpChar.length; i++) {
									rightChar += tmpChar[i] == response.response[i] ? 1 : 0;
								}
								this._one += `${tmpCalculation}_${rightChar}_${
									rightChar + tmpCalculation
								}`;
								this._tmpAll.Num_Score += tmpCalculation;
								this._tmpAll.Letter_Score += rightChar;
								this._tmpAll.Score += rightChar + tmpCalculation;
								score += rightChar + tmpCalculation;
								if (questionNumber < this._questionsNum) {
									this._one += '~';
									questionNumber++;
								}
								tmpCalculation = 0;
								tmpChar = '';
								break;
						}
					});
					const isNext =
						score / ((level + 2) * this._questionsNum * 2) > 0.8 ? true : false;
					resolve(isNext);
				},
			});
		});
	}
	_listener() {
		const labelAddWord = (value, key) => {
			let input = document.getElementById('userAns');
			for (let i = 0; i < value.length; i++) {
				if (value[i] == '_') {
					input.value += key[0];
					return value.slice(0, i) + key[0] + value.slice(i + 1, value.length);
				}
			}
			return value;
		};
		document.addEventListener('keydown', (e) => {
			const submit = document.getElementById('jspsych-survey-html-form-next');
			let output = document.getElementById('userInput');

			if (e.keyCode == 13 && submit != null) submit.click();
			if (e.keyCode >= 65 && e.keyCode <= 90 && output != null)
				output.innerHTML = labelAddWord(
					output.innerHTML,
					String.fromCharCode(e.keyCode)
				);
		});
	}
	async process() {
		this._listener();
		let level = 1; //從level 1開始
		while (true) {
			const isNext = await this._round(level++);
			if (!isNext) break;
		}
		this._all = `${this._tmpAll.finalLevel}_${this._tmpAll.Num_Score}_${this._tmpAll.Letter_Score}_${this._tmpAll.Score}`;
		if (this._mode) {
			return { one: this._one, all: this._all };
		} else {
			return { one: this._one, all: this._all };
		}
	}
}
