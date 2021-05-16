//_ => ~ => -
{
	/* <script src="jspsych-6.3.0/plugins/jspsych-html-button-response.js"></script>
<script src="jspsych-6.3.0/plugins/jspsych-html-keyboard-response.js"></script> */
}
class R {
	constructor(isExercise, clockId) {
		this._one = '';
		this._all = '';
		this._mode = isExercise;
		this._clockId = clockId || 'clock';
		this._questionsNum = 3;
		this._gameWidth = 2;
		this._gameHeight = 3;
		this._gameTime = 180;
		this._imgPath = 'CQ_R_card/';
		this._questionType = {
			TEN: 0,
			GAME: 1,
			SPACE: 2,
		};
		this._cardLists = {};
		this._localScore = {};
		this._tmpAll = {
			final_level: 1,
			totalScore: 0,
		};
	}
	_start(level) {
		const { _questionType: TYPE, _questionsNum: questionsNum } = this;
		let questions = [];
		const questionsBasis = [TYPE.TEN, TYPE.GAME, TYPE.SPACE];
		for (let i = 0; i < questionsNum; i++)
			questions = questions.concat(questionsBasis);
		return questions;
	}

	_level(level, questions) {
		const {
			_questionType: TYPE,
			_gameWidth: width,
			_gameHeight: height,
			_gameTime: gameTime,
			_imgPath: imgPath,
		} = this;
		const createTable = (trail, width, height) => {
			let eachTr = [];
			for (let i = 0; i < width; i++) {
				let tds = '';
				for (let j = 0; j < height; j++) {
					tds += `<td><img id="${trail}_${
						i * height + j
					}" src="${imgPath}Back.jpg"></img></td>`;
				}
				eachTr.push(`<tr>${tds}</tr>`);
			}
			const trs = eachTr.reduce((pre, cur) => {
				return pre + cur;
			}, '');
			const table = `<table>${trs}</table>`;

			return table;
		};
		const getCardList = (cardCount) => {
			const cardChooseListBasis = [
				'A1',
				'B1',
				'C1',
				'D1',
				'A2',
				'B2',
				'C2',
				'D2',
				'A3',
				'B3',
				'C3',
				'D3',
				'A4',
				'B4',
				'C4',
				'D4',
				'A5',
				'B5',
				'C5',
				'D5',
				'A6',
				'B6',
				'C6',
				'D6',
				'A7',
				'B7',
				'C7',
				'D7',
				'A8',
				'B8',
				'C8',
				'D8',
				'A9',
				'B9',
				'C9',
				'D9',
				'A10',
				'B10',
				'C10',
				'D10',
				'A11',
				'B11',
				'C11',
				'D11',
				'A12',
				'B12',
				'C12',
				'D12',
				'A13',
				'B13',
				'C13',
				'D13',
			];
			let cardChooseList = [];
			while (cardChooseList.length < cardCount / 2)
				cardChooseList = cardChooseList.concat(cardChooseListBasis);
			cardChooseList.sort(() => 0.5 - Math.random());
			let halfCardList = cardChooseList.slice(0, cardCount / 2);
			return halfCardList.concat(halfCardList).sort(() => 0.5 - Math.random());
		};
		const cardCount = (width + level) * (height + level);
		let timeline = [];
		let tmpCardList;
		let trail = 1;
		questions.map((value, index) => {
			switch (value) {
				case TYPE.TEN:
					tmpCardList = getCardList(cardCount);
					timeline.push({
						type: 'html-keyboard-response',
						stimulus:
							"<p style='font-size: 30px; font-weight: bold; color: black'>+</p>",
						choices: jsPsych.NO_KEYS,
						trial_duration: 1000,
					});
					break;
				case TYPE.GAME:
					timeline.push({
						type: 'html-button-response',
						stimulus: createTable(trail, width + level, height + level),
						choices: ['success'],
						trial_duration: gameTime * 1000,
					});
					break;
				case TYPE.SPACE:
					this._cardLists[trail++] = tmpCardList;
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

	_round(level) {
		const questions = this._start(level);
		const timeline = this._level(level, questions);
		console.log(timeline);
		let time;
		const clock = document.getElementById(this._clockId);
		let trail = 1;
		let winCount = 0;
		if (level > 1) this._one += '-';
		return new Promise((resolve) => {
			jsPsych.init({
				timeline: timeline,
				display_element: 'jspsych-experiment',
				on_trial_start: () => {
					setTimeout(() => {
						const btn = document.getElementsByTagName('button')[0];
						if (btn) clock.innerHTML = this._gameTime;
						time = setInterval(() => {
							clock.innerHTML = parseInt(clock.innerHTML) - 1;
						}, 1000);
					}, 1);
				},
				on_trial_finish: () => {
					clearInterval(time);
					clock.innerHTML = '<br>';
				},
				on_finish: () => {
					const { _questionType: TYPE } = this;
					const data = JSON.parse(jsPsych.data.get().json());
					console.log(data);
					data.map((value, index) => {
						switch (questions[index]) {
							case TYPE.TEN:
								break;
							case TYPE.GAME:
								if (index > 1) this._one += '~';
								const responseTime =
									value.rt == null
										? this._gameTime * 1000
										: Math.floor(value.rt);
								this._one += `${level}_${responseTime}_${
									this._localScore[trail++] || 0
								}`;
								if (value.response != null) winCount++;
								break;
							case TYPE.SPACE:
								break;
						}
					});
					this._tmpAll.final_level = level;
					this._tmpAll.totalScore += Object.values(this._localScore).reduce(
						(pre, cur) => pre + cur,
						0
					);
					this._localScore = {};
					resolve(winCount > 1);
				},
			});
		});
	}
	_listener() {
		const closeCards = (cards, trail) => {
			const imgs = document.getElementsByTagName('img');
			Object.values(imgs).map((img, index) => {
				if (
					img.id == trail + '_' + cards.arr[0] ||
					img.id == trail + '_' + cards.arr[1]
				) {
					imgs[index].src = this._imgPath + 'Back.jpg';
				}
			});
		};
		const deleteCards = (cards, trail) => {
			const imgs = document.getElementsByTagName('img');
			let isDelete = false;
			Object.values(imgs).map((img, index) => {
				if (
					img.id == trail + '_' + cards.arr[0] ||
					img.id == trail + '_' + cards.arr[1]
				) {
					isDelete = true;
					img.remove();
				}
			});
			if (isDelete) {
				if (!Object.keys(this._localScore).includes(trail.toString()))
					this._localScore[trail] = 0;
				++this._localScore[trail];
			}
		};
		let tmpTrail = 0;
		let openCard = new openCards();
		document.addEventListener('mousedown', (e) => {
			const targetId = e.target.id;
			const splitId = targetId.split('_');
			if (splitId.length == 1 && openCard.length > 0) {
				//not card
				closeCards(openCard, tmpTrail);
				openCard.clearAll();
			} else if (splitId.length == 2) {
				if (tmpTrail != parseInt(splitId[0])) {
					tmpTrail = parseInt(splitId[0]);
					closeCards(openCard, tmpTrail);
					openCard.clearAll();
				}
				//card
				if (openCard.length == 0) {
					const pushSuccess = openCard.push(parseInt(splitId[1]));
					if (!pushSuccess) return;
					const img = document.getElementById(targetId);
					img.src = `${this._imgPath}${
						this._cardLists[tmpTrail][parseInt(splitId[1])]
					}.jpg`;
				} else if (openCard.length == 1) {
					const pushSuccess = openCard.push(parseInt(splitId[1]));
					if (!pushSuccess) return;
					const img = document.getElementById(targetId);
					img.src = `${this._imgPath}${
						this._cardLists[tmpTrail][parseInt(splitId[1])]
					}.jpg`;
					setTimeout(() => {
						openCard.isSame(this._cardLists[tmpTrail]) == true
							? deleteCards(openCard, tmpTrail)
							: closeCards(openCard, tmpTrail);
						openCard.clearAll();
						const imgs = document.getElementsByTagName('img');
						if (Object.values(imgs).length == 0)
							document.getElementsByTagName('button')[0].click();
					}, 250);
				}
			}
		});
	}

	async process() {
		this._listener();
		let level = 1; //從level 1開始
		while (true) {
			const isNext = await this._round(level++);
			if (!isNext) break;
		}
		const { totalScore, final_level } = this._tmpAll;
		this._all = `${final_level}_${totalScore}`;
		if (this._mode) return { one: this._one, all: this._all };
		return { one: this._one, all: this._all };
	}
}

class openCards {
	constructor() {
		this._arr = [];
	}
	get length() {
		return this._arr.length;
	}

	get arr() {
		return this._arr;
	}

	isSame(array) {
		if (this._arr.length != 2) return false;
		if (array[this._arr[0]] != array[this._arr[1]]) return false;
		return true;
	}

	push(num) {
		if (this._arr.length < 2 && !this._arr.includes(num)) {
			this._arr.push(num);
			return true;
		}
		return false;
	}

	clearOne(num) {
		if (this._arr.includes(num)) {
			if (this._arr[0] == num) this._arr.shift();
			if (this._arr[1] == num) this._arr.pop();
			return true;
		}
		return false;
	}

	clearAll() {
		if (this._arr.length > 0) {
			this._arr = [];
			return true;
		}
		return false;
	}
}
