//_ => ~ => -
class A {
    constructor(isExercise, clockId) {
        this._one = '';
        this._all = '';
        this._mode = isExercise;
        this._oneAndAll = '';
        this._clockId = clockId || 'clock';
        this._tmpScore = 0;
        this._randomPlaceCSSParameter = {
            BASIS: 500,
            MIN: 0,
            MAX: 1000,
        }
    }
    _start() {
        // randomize questions_array
        const randomList = (arr) => {
            return arr.sort(function () {
                return 0.5 - Math.random();
            });
        };

        // question[14 個 1, 6 個 2 ]   rule 7 : 3
        let questions = [];
        for (let i = 0; i < 14; i++) {
            questions[i] = '1';
        }
        for (let i = 14; i < 20; i++) {
            questions[i] = '2';
        }

        //but need to randomize questions[] so put into randomList()
        questions = randomList(questions);
        return questions;
    }
    _full_trail(stage) {
        let timeline = [];
        let questions = this._start();
        let returnObject = {};
        //generate random number
        const randomNum = (min, max) => {
            return Math.floor(Math.random() * (max - min) + min);
        };
        //use random number to set random place
        const randomPlaceCSS = (basis, min, max) => {
            return `style="margin-left:${-basis + randomNum(min, max)
                }px;margin-top:${-basis + randomNum(min, max)}px"`;
        };
        // higher level shorter time
        const duration = (level) => {
            return 550 - level * 50;
        };

        // 0 - 19 do 20 times
        for (let i = 0; i < 20; i++) {
            // everytime, always push "+" first
            let ten = {
                type: 'html-keyboard-response',
                stimulus:
                    "<p style='font-size: 30px; font-weight: bold; color: black'>+</p>",
                choices: jsPsych.NO_KEYS,
                trial_duration: randomNum(200, 800),
            };

            // fruits and bomb, choose one to push
            timeline.push(ten);
            if (questions[i] == '1') {
                let randomPicNumber = Math.ceil(Math.random() * 7); //make random photo 1 - 7
                let fruit = {
                    type: 'html-keyboard-response',
                    stimulus:
                        `<img src="/image/A/${randomPicNumber}.jpg"` +
                        randomPlaceCSS(this._randomPlaceCSSParameter.BASIS, this._randomPlaceCSSParameter.MIN, this._randomPlaceCSSParameter.MAX) +
                        '>',
                    choices: ['j'],
                    trial_duration: duration(stage),
                    post_trial_gap: randomNum(150, 300),
                };
                timeline.push(fruit);
            } else {
                let bomb = {
                    type: 'html-keyboard-response',
                    stimulus:
                        '<img src="/image/A/A_Bomb.jpg"' +
                        randomPlaceCSS(this._randomPlaceCSSParameter.BASIS, this._randomPlaceCSSParameter.MIN, this._randomPlaceCSSParameter.MAX) +
                        '>',
                    choices: ['j'],
                    trial_duration: duration(stage),
                    post_trial_gap: randomNum(150, 300),
                };
                timeline.push(bomb);
            }
        }
        //console.log(timeline); //so each level objectArray have 40 objects inside, 20 "+", 20 fruits and bombs mixed
        returnObject.timeline = timeline;
        returnObject.questions = questions;
        return returnObject;
    }
    _round(stage, allData) {
        let returnObject = this._full_trail(stage);
        let questionsPlusTen = [];
        let questionsIndex = 0;
        const score = document.getElementById(this._clockId);

        for (let i = 0; i < 20; i++) {
            questionsPlusTen.push('+');
            questionsPlusTen.push(returnObject.questions[i]);
        }

        return new Promise((resolve) => {
            jsPsych.init({
                timeline: returnObject.timeline,
                display_element: 'jspsych-experiment',
                on_trial_start: () => {
                    score.innerHTML = this._tmpScore;
                },
                on_trial_finish: () => {
                    const lastData = JSON.parse(jsPsych.data.getLastTrialData().json());
                    if ((questionsPlusTen[questionsIndex] == '1' && lastData[0].response == 'j') ||
                        (questionsPlusTen[questionsIndex] == '2' && lastData[0].response == null)) {
                        this._tmpScore++;
                    }
                    questionsIndex++;
                },
                on_finish: function () {
                    let resultArray = [0, 0, 0]; //最後結果陣列
                    let eachLevelAccRate; //判斷該不該進到下一個level
                    let inner_data = ''; //要塞進去 resultArray 也就是對應 this._one
                    //[水果且按下次數, 水果且按下的反應時間加總, 炸彈卻按下次數, 炸彈卻按下的反應時間加總, 正確次數(有水果有按, 有炸彈沒按)]
                    let groupSet = [0, 0, 0, 0, 0];
                    //使用者按下的資訊
                    let data = JSON.parse(jsPsych.data.get().json());
                    //只抓有圖案的也就是陣列裡的奇數
                    for (let i = 1; i < 40; i += 2) {
                        // 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41不做
                        // 0, 1, 2, 3, 4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
                        inner_data +=
                            stage + '_' + returnObject.questions[parseInt(i / 2)] + '_';

                        //判斷是不是做對了 只針對圖片出現時有沒有按對，不管十字"+"
                        if (
                            (returnObject.questions[parseInt(i / 2)] == '1' &&
                                data[i].response == 'j') ||
                            (returnObject.questions[parseInt(i / 2)] == '2' &&
                                data[i].response == null)
                        ) {
                            inner_data += '1_';
                            if (data[i].rt == null) {
                                inner_data += 'NS';
                            } else {
                                inner_data += data[i].rt;
                            }
                            groupSet[4]++;
                        } else {
                            inner_data += '0_';
                            if (data[i].rt == null) {
                                inner_data += 'NS';
                            } else {
                                inner_data += data[i].rt;
                            }
                        }
                        if (i != 39) inner_data += '~';

                        //統計水果出現有按對 和 炸彈出現按錯
                        if (
                            returnObject.questions[parseInt(i / 2)] == '1' &&
                            data[i].response == 'j'
                        ) {
                            groupSet[0]++;
                            groupSet[1] += data[i].rt;
                        } else if (
                            returnObject.questions[parseInt(i / 2)] == '2' &&
                            data[i].response != null
                        ) {
                            groupSet[2]++;
                            groupSet[3] += data[i].rt;
                        }
                        //stage_1_1_~stage_2_1_~stage_1_0_
                    }
                    eachLevelAccRate = (groupSet[4] / 20) * 100; //算每一level正確率

                    allData.RT_count += groupSet[0];
                    allData.RT_time += groupSet[1];
                    allData.FA_RT_count += groupSet[2];
                    allData.FA_RT_time += groupSet[3];
                    allData.Acc += groupSet[4]; //加總每一回合正確題數 同時最後也是 Score

                    resultArray[0] = inner_data; //this._one
                    resultArray[1] = allData; //this._all
                    resultArray[2] = eachLevelAccRate; //judge go to next level or not

                    resolve(resultArray);
                },
            });
        });
    }
    _allGenerate(oneAndAll, stage) {
        let finalAcc = (oneAndAll[1].Acc / (stage * 20)) * 100;
        let finalRT = oneAndAll[1].RT_time / oneAndAll[1].RT_count;
        let finalFA = (oneAndAll[1].FA_RT_count / (stage * 6)) * 100;
        let finalFA_RT = oneAndAll[1].FA_RT_time / oneAndAll[1].FA_RT_count;
        let finalScore = oneAndAll[1].Acc;
        if (finalFA_RT == 0) {
            finalFA_RT = 'NS';
        }
        this._all = `${finalAcc}_${finalRT}_${finalFA}_${finalFA_RT}_${finalScore}`;
        return this._all;
    }
    async process() {
        let stage = 1; //從level 1開始
        let allData = {
            Acc: 0,
            RT_count: 0, //加總所有水果出現有按的次數
            RT_time: 0, //加總所有水果出現有按的反應時間
            FA_RT_count: 0, //加總所有炸彈有出現卻按了的次數
            FA_RT_time: 0, //加總所有炸彈有出現卻按了的反應時間
        };
        while (stage < 8) {
            this._oneAndAll = await this._round(stage, allData);
            this._one += this._oneAndAll[0];
            if (this._oneAndAll[2] < 80) {
                break;
            } else if (stage < 7) {
                this._one += '_';
            }
            ++stage;
        }

        this._all = this._allGenerate(this._oneAndAll, stage);

        if (this._mode == false) {
            console.log(this._mode);
            window.location.reload(); //now I'm using reload to handle practice mode temporary
            // return { one: null, all: null };
        } else {
            console.log(this._mode);
            return { one: this._one, all: this._all };
        }
    }
}
