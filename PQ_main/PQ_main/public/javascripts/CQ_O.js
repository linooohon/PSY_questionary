//_ => ~ => -
{
	/* <script src="/jspsych-6.3.0/plugins/jspsych-survey-html-form.js"></script>
<script src="/jspsych-6.3.0/plugins/jspsych-html-keyboard-response.js"></script> */
	//<script src="/jspsych-6.3.0/plugins/jspsych-image-keyboard-response.js"></script>
}
class O {
	constructor(isExercise) {
		this._one = '';
		this._all = '';
		this._mode = isExercise;
		this._tmpAll = {
			totalScore: 0,
			totalQuestionCount: 0,
		};
		this._levelOffset = 2;
		this._questionsNum = 10;
		this._questionType = {
			TEN: 0,
			IMAGE: 1,
			SURVEY: 2,
			SCORE: 3,
		};
		this._tmpImgList = [];
	}
	_start(level) {
		const {
			_questionsNum: questionsNum,
			_levelOffset: levelOffset,
			_questionType: questionType,
		} = this;

		const questionLength = level + levelOffset;
		let questions = [];
		for (let i = 0; i < questionsNum; i++) {
			questions.push(questionType.TEN);
			for (let j = 0; j < questionLength; j++)
				questions.push(questionType.IMAGE);
			questions.push(questionType.SURVEY);
			questions.push(questionType.SCORE);
		}

		return questions;
	}

	_level(level, questions) {
		const { _questionType: TYPE } = this;
		const generateRandomInt = (min, max) =>
			Math.floor(Math.random() * (max + 1 - min) + min);
		const lowLine = (level) => {
			level += this._levelOffset;
			let str = '';
			for (let i = 0; i < level; i++) str += '_ ';
			return str;
		};
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
				//'/image/CQ_O_picture/1.jpg', <= real environment
				case TYPE.IMAGE:
					const randomInt = generateRandomInt(1, 9);
					this._tmpImgList.push(randomInt);
					timeline.push({
						type: 'image-keyboard-response',
						stimulus: `/image/CQ_O_picture/${randomInt}.jpg`,
						choices: jsPsych.NO_KEYS,
						stimulus_width: 100,
						maintain_aspect_ratio: true,
						trial_duration: 1000,
					});
					break;
				case TYPE.SURVEY:
					timeline.push({
						type: 'survey-html-form',
						html: `<label id="userInput">${lowLine(
							level
						)}</label><input id="userAns" name="response" value="" style="display:none" disable>`,
					});
					break;
				case TYPE.SCORE:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: "<h2 id='grade'>0</h2><h3 id='plus'>+0</h3>",
						choices: jsPsych.NO_KEYS,
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
		let trailScore = 0;
		let eachTrailAns = [];
		this._trailAns = '';
		this._trailPlus = 0;
		let time = 0;
		let trailIndex = 0;
		if (level > 1) this._one += '-';
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: timeline,
				on_trial_start: () => {
					setTimeout(() => {
						const grade = document.getElementById('grade');
						const img = document.getElementById(
							'jspsych-image-keyboard-response-stimulus'
						);
						if (img != null) {
							this._trailAns += this._tmpImgList.shift();
						}
						if (grade != null) {
							let plus = document.getElementById('plus');
							grade.innerText = trailScore;
							plus.innerText = '+' + this._trailPlus;
							trailScore += this._trailPlus;
							eachTrailAns.push(this._trailAns);
							this._trailAns = '';
							this._trailPlus = 0;
						}
						return;
					}, 1);
					time = setTimeout(() => {
						const input = document.getElementById('userAns');
						const submit = document.getElementById(
							'jspsych-survey-html-form-next'
						);
						if (input != null) {
							for (let i = 0; i < input.value.length; i++)
								if (input.value[i] == this._trailAns[i]) this._trailPlus++;
						}
						if (submit != null) {
							submit.click();
						}
					}, 15000);
				},
				on_trial_finish: () => {
					clearTimeout(time);
				},
				on_finish: () => {
					const data = JSON.parse(jsPsych.data.get().json());
					const getSum = (str) => {
						let reNum = 0;
						for (let i = 0; i < str.length; i++) {
							if (str[i] == 1) reNum++;
						}
						return reNum;
					};
					console.log(data);
					data.map((value, index) => {
						switch (questions[index]) {
							case this._questionType.TEN:
								if (trailIndex > 0) this._one += '~';
								this._one += `${level}_${eachTrailAns[trailIndex]}_`;
								break;
							case this._questionType.IMAGE:
								break;
							case this._questionType.SURVEY:
								let rightAns = '';
								for (let i = 0; i < value.response.response.length; i++) {
									rightAns +=
										value.response.response[i] == eachTrailAns[trailIndex][i]
											? '1'
											: '0';
								}
								while (rightAns.length < eachTrailAns[trailIndex].length)
									rightAns += '0';
								trailIndex++;
								this._one +=
									value.response.response +
									`_${rightAns}_${getSum(rightAns)}_` +
									parseInt(value.rt);
								break;
							case this._questionType.SCORE:
								break;
						}
					});

					this._trailAns = '';
					this._trailPlus = 0;
					this._tmpAll.totalScore += trailScore;
					const questionCount =
						(level + this._levelOffset) * this._questionsNum;
					this._tmpAll.totalQuestionCount += questionCount;
					resolve(trailScore / questionCount > 0.8 ? true : false);
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
			if (e.keyCode == 13 && submit != null) {
				const input = document.getElementById('userAns');
				if (input != null) {
					for (let i = 0; i < input.value.length; i++)
						if (input.value[i] == this._trailAns[i]) this._trailPlus++;
				}
				submit.click();
			}
			if (e.keyCode >= 49 && e.keyCode <= 57 && output != null)
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
		const {
			_tmpAll: { totalScore: score, totalQuestionCount: count },
		} = this;
		this._all += score + '_' + score / count;
		if (this._mode) {
			return { one: this._one, all: this._all };
		} else {
			return { one: this._one, all: this._all };
		}
	}
}
