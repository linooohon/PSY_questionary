//_ => ~ => -
class B {
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

        // question[35 個 1, 35 個 2, 30 個 3 ]   rule 7 : 3
        let questions = [];
        for (let i = 0; i < 35; i++) {
            questions[i] = '1';
        }
        for (let i = 35; i < 70; i++) {
            questions[i] = '2';
        }
        for (let i = 70; i < 100; i++) {
            questions[i] = '3';
        }

        //but need to randomize questions[] so put into randomList()
        questions = randomList(questions);
        return questions;
    }
    _full_trail() {
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

        // 0 - 99 do 100 times
        for (let i = 0; i < 100; i++) {
            // everytime, always push "+" first
            let ten = {
                type: 'html-keyboard-response',
                stimulus:
                    "<p style='font-size: 30px; font-weight: bold; color: black'>+</p>",
                choices: jsPsych.NO_KEYS,
                trial_duration: randomNum(200, 800),
            };

            // cars and stop, choose one to push
            timeline.push(ten);
            if (questions[i] == '1') {
                let randomPicNumber = Math.ceil(Math.random() * 3); //make random r photo 1 - 3
                let car = {
                    type: 'html-keyboard-response',
                    stimulus:
                        `<img class="right-car" src="/image/B/R0${randomPicNumber}.jpg"` +
                        randomPlaceCSS(this._randomPlaceCSSParameter.BASIS, this._randomPlaceCSSParameter.MIN, this._randomPlaceCSSParameter.MAX) +
                        '>',
                    choices: ['j'],
                    trial_duration: 500, //持續時間
                    post_trial_gap: randomNum(80, 320), //間隔時間
                };
                timeline.push(car);
            } else if (questions[i] == '2') {
                let randomPicNumber = Math.ceil(Math.random() * 3); //make random l photo 1 - 3
                let car = {
                    type: 'html-keyboard-response',
                    stimulus:
                        `<img class="left-car" src="/image/B/L0${randomPicNumber}.jpg"` +
                        randomPlaceCSS(this._randomPlaceCSSParameter.BASIS, this._randomPlaceCSSParameter.MIN, this._randomPlaceCSSParameter.MAX) +
                        '>',
                    choices: ['f'],
                    trial_duration: 500, //持續時間
                    post_trial_gap: randomNum(80, 320), //間隔時間
                };
                timeline.push(car);
            } else {
                let stop = {
                    type: 'html-keyboard-response',
                    stimulus:
                        '<img src="/image/B/B_Stop.jpg"' +
                        randomPlaceCSS(this._randomPlaceCSSParameter.BASIS, this._randomPlaceCSSParameter.MIN, this._randomPlaceCSSParameter.MAX) +
                        '>',
                    choices: ['j, f'],
                    trial_duration: 500,
                    post_trial_gap: randomNum(80, 320),
                };
                timeline.push(stop);
            }
        }
        //console.log(timeline); //so objectArray have 200 objects inside, 100 "+", 100 cars and stop mixed
        returnObject.timeline = timeline;
        returnObject.questions = questions;
        return returnObject;
    }
    _round(allData) {
        let returnObject = this._full_trail();
        let questionsPlusTen = [];
        let questionsIndex = 0;
        let score = document.getElementById(this._clockId);

        for (let i = 0; i < 100; i++) {
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
                    // console.log(lastData[0].response);
                    if ((questionsPlusTen[questionsIndex] == '1' && lastData[0].response == 'j') ||
                        (questionsPlusTen[questionsIndex] == '2' && lastData[0].response == 'f') ||
                        (questionsPlusTen[questionsIndex] == '3' && lastData[0].response == null)
                    ) {
                        this._tmpScore++;
                    }
                    questionsIndex++;
                },
                on_finish: function () {
                    let resultArray = [0, 0]; //最後結果陣列
                    let inner_data = ''; //要塞進去 resultArray 也就是對應 this._one
                    //[右且按j && 左且按f總次數, 右且按j && 左且按f的反應時間加總, stop卻按下次數, stop卻按下的反應時間加總, 正確次數(有車按對, stop沒按)]
                    let groupSet = [0, 0, 0, 0, 0];
                    //使用者按下的資訊
                    let data = JSON.parse(jsPsych.data.get().json());
                    //只抓有圖案的也就是陣列裡的奇數
                    for (let i = 1; i < 200; i += 2) {
                        // 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41不做
                        // 0, 1, 2, 3, 4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
                        inner_data += returnObject.questions[parseInt(i / 2)] + '_';

                        //判斷是不是做對了 只針對圖片出現時有沒有按對，不管十字"+"
                        if (
                            (returnObject.questions[parseInt(i / 2)] == '1' &&
                                data[i].response == 'j') ||
                            (returnObject.questions[parseInt(i / 2)] == '2' &&
                                data[i].response == 'f') ||
                            (returnObject.questions[parseInt(i / 2)] == '3' &&
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
                        if (i != 199) inner_data += '~';

                        //統計車出現有按對 和 stop出現按錯
                        if (
                            (returnObject.questions[parseInt(i / 2)] == '1' &&
                                data[i].response == 'j') ||
                            (returnObject.questions[parseInt(i / 2)] == '2' &&
                                data[i].response == 'f')
                        ) {
                            groupSet[0]++;
                            groupSet[1] += data[i].rt;
                        } else if (
                            returnObject.questions[parseInt(i / 2)] == '3' &&
                            data[i].response != null
                        ) {
                            groupSet[2]++;
                            groupSet[3] += data[i].rt;
                        }
                        //stage_1_1_~stage_2_1_~stage_1_0_
                    }

                    allData.RT_count += groupSet[0];
                    allData.RT_time += groupSet[1];
                    allData.FA_RT_count += groupSet[2];
                    allData.FA_RT_time += groupSet[3];
                    allData.Acc += groupSet[4]; //加總每一回合正確題數 同時最後也是 Score

                    resultArray[0] = inner_data; //this._one
                    resultArray[1] = allData; //this._all

                    resolve(resultArray);
                },
            });
        });
    }
    _allGenerate(oneAndAll) {
        let finalAcc = (oneAndAll[1].Acc / 100) * 100;
        let finalRT = oneAndAll[1].RT_time / oneAndAll[1].RT_count;
        let finalFA = (oneAndAll[1].FA_RT_count / 30) * 100;
        let finalFA_RT = oneAndAll[1].FA_RT_time / oneAndAll[1].FA_RT_count;
        let finalScore = oneAndAll[1].Acc;
        if (finalFA_RT == 0) {
            finalFA_RT = 'NS';
        }
        this._all = `${finalAcc}_${finalRT}_${finalFA}_${finalFA_RT}_${finalScore}`;
        return this._all;
    }
    async process() {
        let allData = {
            Acc: 0,
            RT_count: 0, //加總所有車出現有按的次數
            RT_time: 0, //加總所有車出現有按的反應時間
            FA_RT_count: 0, //加總所有stop有出現卻按了的次數
            FA_RT_time: 0, //加總所有stop有出現卻按了的反應時間
        };
        this._oneAndAll = await this._round(allData);
        this._one = this._oneAndAll[0];
        this._all = this._allGenerate(this._oneAndAll);
        if (this._mode == false) {
            console.log(this._mode);
            window.location.reload();
            // return { one: null, all: null };
        } else {
            console.log(this._mode);
            return { one: this._one, all: this._all };
        }
    }
}
