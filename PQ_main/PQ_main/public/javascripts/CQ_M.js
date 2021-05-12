//_ => ~ => -
//need <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
// <script src="jspsych-6.3.0/plugins/jspsych-html-button-response.js"></script>
// <script src="jspsych-6.3.0/plugins/jspsych-html-keyboard-response.js"></script>
{
	//parameter add clockId, build div like this
	/* <body>
<div id="clock"></div>
<div id="jspsych-experiment"></div>
</body>
<script>
$(document).ready(() => {
	let m = new M(true, "clock");
	m.process().then(item => console.log(item));
})
</script> */
}
class M {
	constructor(isExercise, clockId) {
		this._one = '';
		this._all = '';
		this._tmpAll = {};
		this._clockId = clockId;
		this._mode = isExercise;
		this._difficulty_TYPE = {
			EASY: 2,
			MEDIUM: 3,
			DIFFICULT: 4,
		};
		this._difficulty = this._difficulty_TYPE.EASY;
		this._question_TYPE = {
			TEN: 0,
			RECTANGLE: 1,
			GREEN_BALL: 2,
			RED_BALL: 3,
			YELLOW_BALL: 4,
			SPACE: 5,
		};
		this._questions_Count_Base = 6;
		this._minBallOffset = 150;
		this._maxBallRange = {
			Lx: -500,
			Rx: 500,
			Ty: -100,
			By: 300,
		};
		this._clockTime = 120;
	}
	_start(trail) {
		//題數6+6*trail
		const questionsCountBase = this._questions_Count_Base;
		const questionsCount = questionsCountBase * (1 + trail);
		let questionsBaseArr = [];
		let questionsArr = [];
		for (let i = 2; i <= this._difficulty; i++) questionsBaseArr.push(i);
		while (questionsArr.length < questionsCount)
			questionsArr = questionsArr.concat(questionsBaseArr);
		questionsArr.sort(() => 0.5 - Math.random());
		questionsArr.push(this._question_TYPE.SPACE);
		return [this._question_TYPE.TEN, this._question_TYPE.RECTANGLE].concat(
			questionsArr
		);
	}
	_trail(questions) {
		const generateRandomInt = (min, max) =>
			Math.floor(Math.random() * (max + 1 - min) + min);
		const newMargin = (maxBallRange) => {
			const { Lx, Rx, Ty, By } = maxBallRange;
			const newXValue = generateRandomInt(0, Rx - Lx) + Lx;
			const newYValue = generateRandomInt(0, By - Ty) + Ty;
			return { X: newXValue, Y: newYValue };
		};
		const twoPointDistance = (lastMargin, newMargin, min) => {
			const dx = Math.abs(lastMargin.X - newMargin.X);
			const dy = Math.abs(lastMargin.Y - newMargin.Y);
			const dis = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
			return dis > min ? true : false;
		};
		const updateMargin = (lastMargin) => {
			const newPoints = newMargin(this._maxBallRange);
			if (twoPointDistance(lastMargin, newPoints, this._minBallOffset)) {
				lastMargin.X = newPoints.X;
				lastMargin.Y = newPoints.Y;
				return true;
			}
			return false;
		};
		let lastMargin = {
			X: 0,
			Y: 0,
		};
		let timeline = [];
		questions.map((question) => {
			switch (question) {
				case this._question_TYPE.TEN:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus:
							"<p style='font-size: 30px; font-weight: bold; color: black'>+</p>",
						choices: jsPsych.NO_KEYS,
						trial_duration: 1000,
					});
					break;
				case this._question_TYPE.RECTANGLE:
					timeline.push({
						type: 'html-button-response',
						stimulus: '<div id="rectangle"></div>',
						choices: ['leftMouse'],
					});
					break;
				case this._question_TYPE.GREEN_BALL:
					while (!updateMargin(lastMargin));
					timeline.push({
						type: 'html-button-response',
						stimulus: `<div id="ball" class="green" style="margin-left:${
							lastMargin.X + 'px'
						};margin-top:${lastMargin.Y + 'px'}"></div>`,
						choices: ['leftMouse'],
						trial_duration: 1000,
					});
					break;
				case this._question_TYPE.RED_BALL:
					while (!updateMargin(lastMargin));
					timeline.push({
						type: 'html-button-response',
						stimulus: `<div id="ball" class="red" style="margin-left:${
							lastMargin.X + 'px'
						};margin-top:${lastMargin.Y + 'px'}"></div>`,
						choices: ['leftMouse', 'rightMouse'],
						trial_duration: 1000,
					});
					break;
				case this._question_TYPE.YELLOW_BALL:
					while (!updateMargin(lastMargin));
					timeline.push({
						type: 'html-button-response',
						stimulus: `<div id="ball" class="yellow" style="margin-left:${
							lastMargin.X + 'px'
						};margin-top:${lastMargin.Y + 'px'}"></div>`,
						choices: ['leftMouse', 'rightMouse'],
						trial_duration: 1000,
					});
					break;
				case this._question_TYPE.SPACE:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: '',
						choices: jsPsych.NO_KEYS,
						trial_duration: 200,
					});
					break;
			}
		});
		return timeline;
	}

	_round(trail) {
		const questions = this._start(trail);
		const timeline = this._trail(questions);
		console.log(timeline);
		let index = 0;
		this._accumulatedError = 0;
		if (trail > 1) this._one += '~';
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: timeline,
				display_element: 'jspsych-experiment',
				on_trial_start: () => {},
				on_trial_finish: () => {
					//計算累積錯誤
					const { YELLOW_BALL, RED_BALL, GREEN_BALL } = this._question_TYPE;
					if (this._isClick == false) {
						if (questions[index] == YELLOW_BALL) this._accumulatedError = 0;
						if (questions[index] == RED_BALL || questions[index] == GREEN_BALL)
							this._accumulatedError++;
						if (this._accumulatedError > 2) {
							window.clearInterval(this._clockID);
							jsPsych.endExperiment('tooMuch error');
						}
					}
					index++;
					this._isClick = false;
				},
				on_finish: () => {
					this._time = parseInt(new Date() - this._time);
					const getDisAndUpdate = (lastMargin, newMargin) => {
						const dx = Math.abs(lastMargin.X - newMargin.X);
						const dy = Math.abs(lastMargin.Y - newMargin.Y);
						const dis = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
						lastMargin.X = newMargin.X;
						lastMargin.Y = newMargin.Y;
						return dis;
					};
					const getNewPlace = (value) => {
						const stimulus = value.stimulus;
						const x = stimulus.split('margin-left:')[1].split('px')[0];
						const y = stimulus.split('margin-top:')[1].split('px')[0];
						return { X: x, Y: y };
					};
					const data = JSON.parse(jsPsych.data.get().json());
					const {
						_question_TYPE: TYPE,
						_difficulty: difficulty,
						_time: timeSum,
					} = this;
					window.clearInterval(this._clockID);
					console.log(data);
					let errorCount = 0;
					let distanceSum = 0;
					let prePlace = { X: 0, Y: 0 };
					data.map((value, index) => {
						switch (questions[index]) {
							case TYPE.TEN:
								const questionCount =
									data.length < questions.length
										? data.length - 2
										: data.length - 3;
								this._one += `${difficulty - 1}_${questionCount}_`;
								break;
							case TYPE.RECTANGLE:
								break;
							case TYPE.GREEN_BALL:
								distanceSum += getDisAndUpdate(prePlace, getNewPlace(value));
								errorCount += value.response == 0 ? 0 : 1;
								break;
							case TYPE.RED_BALL:
								distanceSum += getDisAndUpdate(prePlace, getNewPlace(value));
								errorCount += value.response == 1 ? 0 : 1;
								break;
							case TYPE.YELLOW_BALL:
								distanceSum += getDisAndUpdate(prePlace, getNewPlace(value));
								errorCount += value.response == null ? 0 : 1;
								break;
							case TYPE.SPACE:
								distanceSum = Math.floor(distanceSum);
								this._one += `${errorCount}_${distanceSum}_${timeSum - 200}`;
								break;
						}
					});
					if (data.length < questions.length) {
						distanceSum = Math.floor(distanceSum);
						this._one += `${errorCount}_${distanceSum}_${timeSum}`;
					}
					resolve(data.length);
				},
			});
		});
	}

	_listener() {
		//初始化倒計時鐘
		const clock = document.getElementById(this._clockId);
		clock.innerHTML = '<br>';

		//阻止右鍵選單
		document.oncontextmenu = function (event) {
			event.preventDefault();
		};
		//listen click
		this._accumulatedError = 0;
		this._isClick = false;
		const click = (str, btn) => (btn?.innerHTML == str ? btn.click() : null);
		const buttons = document.getElementsByClassName('jspsych-btn');
		const idList = ['rectangle', 'ball'];
		const clickHandlerLeft = (e) => {
			if (idList.includes(e.target.id) && e.button == 0) {
				this._isClick = true;
				click('leftMouse', buttons[0]);
				//開始倒計時
				if (e.target.id == 'rectangle') {
					clock.innerText = this._clockTime;
					this._time = new Date();
					this._clockID = window.setInterval(() => {
						const nowTime = parseInt(clock.innerText);
						if (nowTime == 0) {
							window.clearInterval(this._clockID);
							jsPsych.endExperiment('time is out');
							return;
						}
						clock.innerText = nowTime - 1;
					}, 1000);
				}
				//計算累積錯誤
				if (e.target.id == 'ball') {
					$(e.target).attr('class') == 'green'
						? (this._accumulatedError = 0)
						: this._accumulatedError++;
					if (this._accumulatedError > 2) {
						window.clearInterval(this._clockID);
						jsPsych.endExperiment('tooMuch error');
					}
				}
				return;
			}
		};
		const { _difficulty: difficulty, _difficulty_TYPE: TYPE } = this;
		const clickHandlerRight = (e) => {
			if ('ball' == e.target.id && e.button == 2 && difficulty != TYPE.EASY) {
				this._isClick = true;
				click('rightMouse', buttons[1]);
				//計算累積錯誤
				$(e.target).attr('class') == 'red'
					? (this._accumulatedError = 0)
					: this._accumulatedError++;
				if (this._accumulatedError > 2) {
					window.clearInterval(this._clockID);
					jsPsych.endExperiment('tooMuch error');
				}
				return;
			}
		};
		document.addEventListener('click', clickHandlerLeft);
		document.addEventListener('mousedown', clickHandlerRight);
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
				display_element: 'jspsych-experiment',
				on_finish: () => {
					const data = JSON.parse(jsPsych.data.get().json());
					console.log(data);
					const translate = {
						e: 'EASY',
						m: 'MEDIUM',
						d: 'DIFFICULT',
					};
					this._difficulty = this._difficulty_TYPE[translate[data[0].response]];
					resolve(this._difficulty);
				},
			});
		});
	}

	_calculateAll(one) {
		const data = one;
		const trails = data.split('~');
		const finalTrails = trails[trails.length - 1].split('_');
		const level = finalTrails[0];
		const exerciseLength = trails.length - 1;
		const finalGoalNum = this._questions_Count_Base * (1 + trails.length);
		const finalUnComplete = finalGoalNum - finalTrails[1];
		const finalRightNum = finalTrails[1] - finalTrails[2];
		const finalRange = finalTrails[3];
		const finalTime = finalTrails[4];
		if (exerciseLength == 0) {
			return `${level}_0_0_${finalGoalNum}_${finalUnComplete}_${finalRightNum}_${finalRange}_${finalTime}`;
		}
		trails.pop();
		const { sumDis, sumTime } = trails.reduce(
			(pre, cur) => {
				const tmp = cur.split('_');
				return {
					sumDis: pre.sumDis + parseInt(tmp[3]),
					sumTime: pre.sumTime + parseInt(tmp[4]),
				};
			},
			{
				sumDis: 0,
				sumTime: 0,
			}
		);
		return `${level}_${Math.floor(sumDis / exerciseLength)}_${Math.floor(
			sumTime / exerciseLength
		)}_${finalGoalNum}_${finalUnComplete}_${finalRightNum}_${finalRange}_${finalTime}`;
	}

	async process() {
		await this._chooseMode();
		this._listener();
		for (let i = 1; ; i++) {
			const questionsCountBase = this._questions_Count_Base;
			const questionsCount = questionsCountBase * (1 + i);
			const resultLength = await this._round(i);
			if (resultLength < questionsCount) break;
		}
		const clock = document.getElementById(this._clockId);
		clock.innerHTML = '<br>';
		this._all = this._calculateAll(this._one);
		return this._mode
			? { one: this._one, all: this._all }
			: { one: this._one, all: this._all };
	}
}
