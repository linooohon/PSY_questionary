//_ => ~ => -
{
	/* <script src="/jspsych-6.3.0/plugins/jspsych-html-keyboard-response.js"></script> */
	// <div id="clock"></div>
	// <div id="jspsych-experiment"></div>
	// let l = new L(true, "clock");
}
class L {
	constructor(isExercise, clockId) {
		this._one = '';
		this._all = '';
		this._tmpAll = {
			Acc: 0,
			RT: 0,
			Pos_Acc: 0,
			Pos_RT: 0,
			Col_Acc: 0,
			Col_RT: 0,
			Score: 0,
		};
		this._clockId = clockId || 'clock';
		this._mode = isExercise;
		this._questionsNum = 100;
		this._imgPath = '/image/L/';
		this._bounder = {
			x: 155,
			y: 70,
		};
		this._questionType = {
			TEN: 0,
			CLUE_PLACE: 1,
			CLUE_COLOR: 2,
			TABLE_J: 3,
			TABLE_F: 4,
			WHITE: 5,
		};
	}
	_start() {
		const { _questionType: TYPE, _questionsNum: questionsNum } = this;
		const getClueList = () => {
			const clue_basis = [TYPE.CLUE_PLACE, TYPE.CLUE_COLOR];
			let clueList = [];
			for (let i = 0; i < questionsNum / 2; i++)
				clueList = clueList.concat(clue_basis);
			return clueList.sort(() => 0.5 - Math.random());
		};
		let questions = [];
		const clueList = getClueList();
		clueList.map((clue) => {
			const trail = [
				TYPE.TEN,
				clue,
				Math.random() > 0.5 ? TYPE.TABLE_J : TYPE.TABLE_F,
				TYPE.WHITE,
			];
			questions = questions.concat(trail);
		});
		return questions;
	}

	_level(questions) {
		const {
			_questionType: TYPE,
			_imgPath: path,
			_bounder: { x: bounderX, y: bounderY },
		} = this;
		const generateRandomInt = (min, max) =>
			Math.floor(Math.random() * (max + 1 - min) + min);
		const getStimulus = ({ curState, preState }) => {
			const getColor = (preState, curState) => {
				const clr1 = 'orange';
				const clr2 = 'white';
				if (preState == TYPE.CLUE_PLACE)
					return Math.random() > 0.5 ? clr1 : clr2;
				return curState == TYPE.TABLE_J ? clr1 : clr2;
			};

			const getPlace = (preState, curState) => {
				const x = generateRandomInt(20, bounderX);
				const y =
					Math.random() > 0.5
						? generateRandomInt(0, bounderY)
						: -generateRandomInt(0, bounderY);
				if (preState == TYPE.CLUE_COLOR)
					return Math.random() > 0.5 ? { x: +x, y } : { x: -x, y };
				return curState == TYPE.TABLE_J ? { x: +x, y } : { x: -x, y };
			};

			const { x, y } = getPlace(preState, curState);
			return `<img src='${path}table.jpg' class="table"><img src='${path}${getColor(
				preState,
				curState
			)}.jpg' style='margin-left:${x}px;margin-top:${y}px;'  class="ball">`;
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
						trial_duration: generateRandomInt(200, 800),
					});
					break;
				case TYPE.CLUE_COLOR:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: '<h3>顏色</h3>',
						choices: jsPsych.NO_KEYS,
						trial_duration: 150,
					});
					break;
				case TYPE.CLUE_PLACE:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: '<h3>位置</h3>',
						choices: jsPsych.NO_KEYS,
						trial_duration: 150,
					});
					break;
				case TYPE.TABLE_J:
				case TYPE.TABLE_F:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: getStimulus({
							curState: value,
							preState: questions[index - 1],
						}),
						choices: ['j', 'f'],
						trial_duration: 500,
					});
					break;
				case TYPE.WHITE:
					timeline.push({
						type: 'html-keyboard-response',
						stimulus: `<label id="score"><label>`,
						choices: jsPsych.NO_KEYS,
						trial_duration: generateRandomInt(100, 300),
					});
					break;
			}
		});
		return timeline;
	}

	_round() {
		const questions = this._start();
		const timeline = this._level(questions);
		console.log(timeline);
		let questionsIndex = 0;
		const score = document.getElementById(this._clockId);
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: timeline,
				display_element: 'jspsych-experiment',
				on_trial_start: () => {
					score.innerHTML = this._tmpAll.Score;
				},
				on_trial_finish: () => {
					if (
						questions[questionsIndex] == this._questionType.TABLE_J ||
						questions[questionsIndex] == this._questionType.TABLE_F
					) {
						const lastData = JSON.parse(jsPsych.data.getLastTrialData().json());
						const localType =
							questions[questionsIndex] == this._questionType.TABLE_J
								? 'j'
								: 'f';
						this._tmpAll.Score += localType == lastData[0].response ? 1 : 0;
					}
					questionsIndex++;
				},
				on_finish: () => {
					const { _questionType: TYPE } = this;
					const data = JSON.parse(jsPsych.data.get().json());
					console.log(data);
					let tmpAll = this._tmpAll;
					let typeJ = null;
					data.map((value, index) => {
						switch (questions[index]) {
							case TYPE.TEN:
								if (index > 0) this._one += '~';
								break;
							case TYPE.CLUE_COLOR:
								this._one += '2_';
								break;
							case TYPE.CLUE_PLACE:
								this._one += '1_';
								break;
							case TYPE.TABLE_J:
								typeJ = 'j';
							case TYPE.TABLE_F:
								const type = typeJ || 'f';
								const CorrAns = type == 'j' ? 1 : 2;
								const press =
									value.response == null ? 'NS' : value.response == 'j' ? 1 : 2;
								const acc = CorrAns == press ? 1 : 0;
								const rt = value.rt == null ? 'NS' : Math.floor(value.rt);
								this._one += `${CorrAns}_${press}_${acc}_${rt}`;

								if (acc == 1) {
									tmpAll.Acc++;
									tmpAll.RT += rt;
									if (questions[index - 1] == TYPE.CLUE_PLACE) {
										tmpAll.Pos_Acc++;
										tmpAll.Pos_RT += rt;
									} else if (questions[index - 1] == TYPE.CLUE_COLOR) {
										tmpAll.Col_Acc++;
										tmpAll.Col_RT += rt;
									}
								}
								typeJ = null;
								break;
							case TYPE.WHITE:
								break;
						}
					});
					resolve('end');
				},
			});
		});
	}

	async process() {
		await this._round();
		const { Acc, RT, Score, Col_Acc, Col_RT, Pos_RT, Pos_Acc } = this._tmpAll;
		this._all = `${Math.floor((Acc * 100) / this._questionsNum)}_${Math.floor(
			RT / Acc
		)}_${Math.floor((Pos_Acc * 100) / (this._questionsNum / 2))}_${Math.floor(
			Pos_RT / Pos_Acc
		)}_${Math.floor((Col_Acc * 100) / (this._questionsNum / 2))}_${Math.floor(
			Col_RT / Col_Acc
		)}_${Score}`;
		if (this._mode) return { one: this._one, all: this._all };
		return { one: this._one, all: this._all };
	}
}
