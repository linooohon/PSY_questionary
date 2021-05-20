//_ => ~ => -
{
	/* <script src="jspsych-6.3.0/plugins/jspsych-html-button-response.js"></script>
<script src="jspsych-6.3.0/plugins/jspsych-html-keyboard-response.js"></script> */
	{
		/* jquery 
		<div id="clock"></div>
  <div id="jspsych-experiment"></div> */
	}
}
class S {
	constructor(isExercise, clockId) {
		this._one = '';
		this._all = '';
		this._tmpAll = {
			level: 0,
			score: 0,
		};
		this._mode = isExercise;
		this._clockId = clockId || 'clock';
		this._questionsNum = 3;
		this._gameWidth = 3;
		this._gameHeight = 5;
		this._gameTime = 180;
		this._imgPath = '/image/gabor/';
		this._questionType = {
			TEN: 0,
			GAME: 1,
			SPACE: 2,
		};
		this._imgMode_TYPE = {
			STATIC: 'STATIC',
			DYNAMIC: 'DYNAMIC',
		};
		this._imgMode = this._imgMode_TYPE.DYNAMIC;
		this._cardLists = {};
		this._localScore = {};
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
		const createTable = (trail, width, height, tmpCardList) => {
			let eachTr = [];
			for (let i = 0; i < width; i++) {
				let tds = '';
				for (let j = 0; j < height; j++) {
					const index = i * height + j;
					const imgSrc =
						this._imgMode == this._imgMode_TYPE.STATIC
							? `${imgPath}${tmpCardList[index]}/5.png`
							: `${imgPath}gif/${tmpCardList[index]}.gif`;
					tds += `<td><img id="${trail}_${index}" src="${imgSrc}"></img></td>`;
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
				'1_0',
				'1_45',
				'1_90',
				'1_135',
				'2_0',
				'2_45',
				'2_90',
				'2_135',
				'3_0',
				'3_45',
				'3_90',
				'3_135',
				'4_0',
				'4_45',
				'4_90',
				'4_135',
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
						stimulus: createTable(
							trail,
							width + level,
							height + level,
							tmpCardList
						),
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
		this._tmpAll.level = level;
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
					const {
						_questionType: TYPE,
						_gameTime: gameTime,
						_localScore: score,
					} = this;
					const data = JSON.parse(jsPsych.data.get().json());
					console.log(data);
					let trail = 0;
					data.map((value, index) => {
						switch (questions[index]) {
							case TYPE.TEN:
								if (index > 0) this._one += '~';
								break;
							case TYPE.GAME:
								const rt =
									value.rt == null ? gameTime * 1000 : Math.floor(value.rt);
								if (value.rt != null) winCount++;
								this._one += `${level}_${rt}_${score[++trail] || 0}`;
								break;
							case TYPE.SPACE:
								break;
						}
					});
					const roundScore = Object.values(score).reduce(
						(pre, cur) => pre + cur,
						0
					);
					this._tmpAll.score += roundScore;
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
					$('#' + img.id).removeClass('yellow');
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
					$('#' + img.id)
						.removeClass('yellow')
						.addClass('green');
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
				if ($('#' + targetId).hasClass('green')) return;
				//card
				if (openCard.length == 0) {
					const pushSuccess = openCard.push(parseInt(splitId[1]));
					if (!pushSuccess) return;
					$('#' + targetId).addClass('yellow');
				} else if (openCard.length == 1) {
					const pushSuccess = openCard.push(parseInt(splitId[1]));
					if (!pushSuccess) return;
					$('#' + targetId).addClass('yellow');
					setTimeout(() => {
						openCard.isSame(this._cardLists[tmpTrail]) == true
							? deleteCards(openCard, tmpTrail)
							: closeCards(openCard, tmpTrail);
						openCard.clearAll();
						const imgs = document.getElementsByClassName('green');
						if (Object.values(imgs).length == this._cardLists[tmpTrail].length)
							document.getElementsByTagName('button')[0].click();
					}, 250);
				}
			}
		});
	}

	_chooseMode() {
		return new Promise((resolve) => {
			jsPsych.init({
				display_element: 'jspsych-experiment',
				timeline: [
					{
						type: 'html-keyboard-response',
						stimulus:
							"<h1>請選擇您想要模式</h1><h3>靜態圖片按鍵盤'S'</h3><h3>動態圖片按鍵盤'D'</h3>",
						choices: ['s', 'd'],
					},
				],
				on_finish: () => {
					const data = JSON.parse(jsPsych.data.get().json());
					console.log(data);
					switch (data[0].response) {
						case 's':
							this._imgMode = this._imgMode_TYPE.STATIC;
							break;
						case 'd':
							this._imgMode = this._imgMode_TYPE.DYNAMIC;
							break;
					}
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
		const { level: finalLevel, score: finalScore } = this._tmpAll;
		this._all += `${finalLevel}_${finalScore}`;
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
