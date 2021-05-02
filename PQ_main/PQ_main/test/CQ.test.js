const should = require('should');
const expect = require('chai').expect;
const fs = require('fs');

describe.skip('test if A data is right => have level', () => {
	let one = '',
		all = '';
	before(() => {
		fs.readFile('data/oneA.txt', function (err, buf) {
			one = buf.toString();
		});
		fs.readFile('data/allA.txt', function (err, buf) {
			all = buf.toString();
		});
	});

	it('one data situation', () => {
		const levels = one.split('-');
		levels.length.should.equal(7);
		let questionList = [];
		levels.map((level) => {
			const questions = level.split('~');
			questions.length.should.equal(20);
			questions.map((trail) => {
				questionList.push(trail);
			});
		});
		questionList.length.should.equal(140);
		questionList.map((questions, index) => {
			const question = questions.split('_');
			question.length.should.equal(4);
			question[0].should.equal(parseInt(index / 20) + 1);
			question[1].should.oneOf(['1', '2']);
			question[2].should.oneOf(['0', '1']);
			expect(question[3]).to.satisfy((x) => {
				if (x == 'NS') {
					return true;
				}
				if (parseInt(x).toString() !== 'NaN') {
					return true;
				}
				return false;
			});
		});
	});

	it('all data is right', () => {
		const ans = all.split('_');
		ans.length.should.equal(5);
		const levels = one.split('-');
		let questionList = [];
		levels.map((level) => {
			const questions = level.split('~');
			questions.map((trail) => {
				questionList.push(trail);
			});
		});
		let right = 0;
		let totalCount = 0;

		let sumRt = 0;
		let RtCount = 0;

		let bombPush = 0;
		let bombCount = 0;

		let bombAndPushRtSum = 0;

		let score = 0;
		questionList.map((questions, index) => {
			const question = questions.split('_');
			totalCount++;
			if (question[2] == '1') {
				right++;
			}

			if (question[3] != 'NS' && question[1] == '1') {
				RtCount++;
				sumRt += parseInt(question[3]);
			}

			if (question[1] == '2' && question[2] == '0' && question[3] != 'NS') {
				bombCount++;
				bombPush++;
				bombAndPushRtSum += parseInt(question[3]);
			} else if (question[1] == '2') {
				bombCount++;
			}

			if (question[2] == '1') {
				score++;
			}
		});

		Math.floor(parseFloat(ans[0])).should.equal(
			Math.floor((100 * right) / totalCount)
		);
		Math.floor(parseFloat(ans[1])).should.equal(
			Math.floor((100 * sumRt) / RtCount)
		);
		Math.floor(parseFloat(ans[2])).should.equal(
			Math.floor((100 * bombPush) / bombCount)
		);
		Math.floor(parseFloat(ans[3])).should.equal(
			Math.floor((100 * bombAndPushRtSum) / bombCount)
		);
		ans[4].should.equal(score.toString());
	});
});

describe.skip('test if B data is right => no level', () => {
	let one = '',
		all = '';
	before(() => {
		fs.readFile('data/oneB.txt', function (err, buf) {
			one = buf.toString();
		});
		fs.readFile('data/allB.txt', function (err, buf) {
			all = buf.toString();
		});
	});

	it('if one is right', () => {
		let questionList = one.split('~');
		questionList.length.should.equal(100);
		questionList.map((questions, index) => {
			const question = questions.split('_');
			question.length.should.equal(3);
			question[0].should.oneOf(['1', '2', '3']);
			question[1].should.oneOf(['0', '1']);
			expect(question[2]).to.satisfy((x) => {
				if (x == 'NS') {
					return true;
				}
				if (parseInt(x).toString() !== 'NaN') {
					return true;
				}
				return false;
			});
		});
	});

	it('if all data is right', () => {
		const ans = all.split('_');
		ans.length.should.equal(5);
		let questionList = one.split('~');

		let right = 0;
		let totalCount = 0;

		let sumRt = 0;
		let RtCount = 0;

		let bombPush = 0;
		let bombCount = 0;

		let bombAndPushRtSum = 0;

		let score = 0;
		questionList.map((questions, index) => {
			const question = questions.split('_');
			totalCount++;
			if (question[1] == '1') {
				right++;
			}

			if (question[2] != 'NS' && question[1] == '1' && question[0] !== '3') {
				RtCount++;
				sumRt += parseInt(question[2]);
			}

			if (question[0] == '3' && question[1] == '0' && question[2] != 'NS') {
				bombCount++;
				bombPush++;
				bombAndPushRtSum += parseInt(question[2]);
			} else if (question[0] == '3') {
				bombCount++;
			}

			if (question[1] == '1') {
				score++;
			}
		});

		Math.floor(parseFloat(ans[0])).should.equal(
			Math.floor((100 * right) / totalCount)
		);
		Math.floor(parseFloat(ans[1])).should.equal(
			Math.floor((100 * sumRt) / RtCount)
		);
		Math.floor(parseFloat(ans[2])).should.equal(
			Math.floor((100 * bombPush) / bombCount)
		);
		Math.floor(parseFloat(ans[3])).should.equal(
			Math.floor((100 * bombAndPushRtSum) / bombCount)
		);
		ans[4].should.equal(score.toString());
	});
});

describe.skip('test if C data is right => have level', () => {
	let one = '',
		all = '';
	before(() => {
		fs.readFile('data/oneC.txt', function (err, buf) {
			one = buf.toString();
		});
		fs.readFile('data/allC.txt', function (err, buf) {
			all = buf.toString();
		});
	});

	it('one data situation', () => {
		const levels = one.split('-');
		levels.length.should.lessThan(8);
		let questionList = [];
		levels.map((level) => {
			const questions = level.split('~');
			questions.length.should.equal(20);
			questions.map((trail) => {
				questionList.push(trail);
			});
		});

		questionList.map((questions, index) => {
			const question = questions.split('_');
			question.length.should.equal(4);
			question[0].should.equal(parseInt(index / 20) + 1);
			question[1].should.oneOf(['1', '2', '3']);
			question[2].should.oneOf(['0', '1']);
			expect(question[3]).to.satisfy((x) => {
				if (x == 'NS') {
					return true;
				}
				if (parseInt(x).toString() !== 'NaN') {
					return true;
				}
				return false;
			});
		});
	});

	it('all data is right', () => {
		const ans = all.split('_');
		ans.length.should.equal(5);
		const levels = one.split('-');
		let questionList = [];
		levels.map((level) => {
			const questions = level.split('~');
			questions.map((trail) => {
				questionList.push(trail);
			});
		});
		let right = 0;
		let totalCount = 0;

		let sumRt = 0;
		let RtCount = 0;

		let bombPush = 0;
		let bombCount = 0;

		let bombAndPushRtSum = 0;

		let score = 0;
		questionList.map((questions, index) => {
			const question = questions.split('_');
			totalCount++;
			if (question[2] == '1') {
				right++;
			}

			if (question[1] != '3' && question[2] == '1' && question[3] !== 'NS') {
				RtCount++;
				sumRt += parseInt(question[3]);
			}

			if (question[1] == '3' && question[2] == '0' && question[3] != 'NS') {
				bombCount++;
				bombPush++;
				bombAndPushRtSum += parseInt(question[3]);
			} else if (question[1] == '3') {
				bombCount++;
			}

			if (question[2] == '1') {
				score++;
			}
		});

		Math.floor(parseFloat(ans[0])).should.equal(
			Math.floor((100 * right) / totalCount)
		);
		Math.floor(parseFloat(ans[1])).should.equal(
			Math.floor((100 * sumRt) / RtCount)
		);
		Math.floor(parseFloat(ans[2])).should.equal(
			Math.floor((100 * bombPush) / bombCount)
		);
		Math.floor(parseFloat(ans[3])).should.equal(
			Math.floor((100 * bombAndPushRtSum) / bombCount)
		);
		ans[4].should.equal(score.toString());
	});
});

describe.skip('test if D data is right => have level', () => {
	let one = '',
		all = '';
	before(() => {
		fs.readFile('data/oneD.txt', function (err, buf) {
			one = buf.toString();
		});
		fs.readFile('data/allD.txt', function (err, buf) {
			all = buf.toString();
		});
	});

	it('one data situation', () => {
		const levels = one.split('-');
		levels.length.should.lessThan(11);
		let questionList = [];
		levels.map((level) => {
			const questions = level.split('~');
			questions.length.should.equal(40);
			questions.map((trail) => {
				questionList.push(trail);
			});
		});

		questionList.map((questions, index) => {
			const question = questions.split('_');
			question.length.should.equal(4);
			question[0].should.equal(parseInt(index / 40) + 1);
			question[1].should.oneOf(['R', 'L']);
			question[2].should.oneOf(['0', '1', '2']);
			question[3].should.oneOf(['0', '1', '2']);
			question[4].should.oneOf(['0', '1']);
			expect(question[5]).to.satisfy((x) => {
				if (x == 'NS') {
					return true;
				}
				if (parseInt(x).toString() !== 'NaN') {
					return true;
				}
				return false;
			});
			expect(question[6]).to.satisfy((x) => {
				if (x == 'NS') {
					return true;
				}
				if (parseInt(x).toString() !== 'NaN') {
					return true;
				}
				return false;
			});
		});
	});

	it('all data is right', () => {
		const ans = all.split('_');
		ans.length.should.equal(52);
		const levels = one.split('-');
		const maxLevel = levels.length;
		const delta = 10 - maxLevel;
		ans[0].should.equal(maxLevel.toString());
		ans[51].should.is.satisfy((x) => {
			if (parseInt(x).toString() != 'NaN') return true;
			return false;
		});
		let countNA = 0;
		for (let i of ans) {
			if (i == 'NA') countNA++;
		}
		countNA.should.equal(5 * delta);
	});
});
