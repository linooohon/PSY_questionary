//_ => ~ => -
class C {
  constructor(isExercise) {
    this._one = "";
    this._all = "";
    this._mode = "isExercise";
    this._oneAndAll = "";
  }
  _start() {
    const randomList = (arr) => {
      return arr.sort(function () {
        return 0.5 - Math.random();
      });
    };
    let questions = [];
    for (let i = 0; i < 7; i++) {
      questions[i] = "1";
    }
    for (let i = 7; i < 14; i++) {
      questions[i] = "2";
    }
    for (let i = 14; i < 20; i++) {
      questions[i] = "3";
    }
    questions = randomList(questions);
    return questions;
  }
  _full_trail(stage) {
    let timeline = [];
    let questions = this._start();

    const randomNum = (min, max) => {
      return Math.floor(Math.random() * (max - min) + min);
    };

    const randomPlaceCSS = (basis, min, max) => {
      return `style="margin-left:${-basis + randomNum(min, max)}px;margin-top:${
        -basis + randomNum(min, max)
      }px"`;
    };

    const duration = (level) => {
      return 550 - level * 50;
    };

    for (let i = 0; i < 20; i++) {
      let ten = {
        type: "html-keyboard-response",
        stimulus:
          "<p style='font-size: 200px; font-weight: bold; color: black'>+</p>",
        choices: jsPsych.NO_KEYS,
        trial_duration: randomNum(200, 800),
      };
      timeline.push(ten);
      if (questions[i] == "1") {
        let white = {
          type: "html-keyboard-response",
          stimulus:
            '<img id="white_ball" src="/image/img_CQ/C/White.jpg"' +
            randomPlaceCSS(500, 0, 1000) +
            ">",
          choices: ["j", "f"],
          trial_duration: duration(stage),
          post_trial_gap: randomNum(150, 300),
        };
        timeline.push(white);
      }
      if (questions[i] == "2") {
        let orange = {
          type: "html-keyboard-response",
          stimulus:
            '<img id="orange_ball" src="/image/img_CQ/C/Orange.jpg"' +
            randomPlaceCSS(500, 0, 1000) +
            ">",
          choices: ["j", "f"],
          trial_duration: duration(stage),
          post_trial_gap: randomNum(150, 300),
        };
        timeline.push(orange);
      } else {
        let racket = {
          type: "html-keyboard-response",
          stimulus:
            '<img id="racket" src="/image/img_CQ/C/Racket.jpg"' +
            randomPlaceCSS(500, 0, 1000) +
            ">",
          choices: ["j", "f"],
          trial_duration: duration(stage),
          post_trial_gap: randomNum(150, 300),
        };
        timeline.push(racket);
      }
    }
    console.log(timeline);
    return timeline;
  }

  //利用_trail組成很多題目的回合, 回傳整理好的one,all 資料
  _round(stage, allData) {
    let timeline = this._full_trail(stage);
    let questions = this._start();
    return new Promise((resolve) => {
      jsPsych.init({
        timeline: timeline,
        on_finish: function () {
          let resultArray = [0, 0, 0]; //最後結果陣列
          let eachLevelAccRate; //判斷該不該進到下一個level
          let inner_data = "";
          //[右且按j && 左且按f總次數, 右且按j && 左且按f的反應時間加總, stop卻按下次數, stop卻按下的反應時間加總, 正確次數(有車按對, stop沒按)]
          let groupSet = [0, 0, 0, 0, 0];
          //使用者按下的資訊
          let data = JSON.parse(jsPsych.data.get().json());
          for (let i = 1; i < 40; i += 2) {
            inner_data += stage + "_" + questions[parseInt(i / 2)] + "_";
            if (
              (questions[parseInt(i / 2)] == "1" && data[i].response == "j") ||
              (questions[parseInt(i / 2)] == "2" && data[i].response == "f") ||
              (questions[parseInt(i / 2)] == "3" && data[i].response == null)
            ) {
              inner_data += "1_";
              if (data[i].rt == null) {
                inner_data += "NS";
              } else {
                inner_data += data[i].rt;
              }
              groupSet[4]++;
            } else {
              inner_data += "0_";
              if (data[i].rt == null) {
                inner_data += "NS";
              } else {
                inner_data += data[i].rt;
              }
            }
            if (i != 39) inner_data += "~";

            //球出現 白or橘 以及 球拍 卻按錯的統計
            if (
              (questions[parseInt(i / 2)] == "1" && data[i].response == "j") ||
              (questions[parseInt(i / 2)] == "2" && data[i].response == "f")
            ) {
              groupSet[0]++;
              groupSet[1] += data[i].rt;
            } else if (
              questions[parseInt(i / 2)] == "3" &&
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
          resultArray[2] = eachLevelAccRate; //judge go to next level or not

          resolve(resultArray);
        },
      });
    });
  }

  _allGenerate(oneAndAll) {
    let finalAcc = (oneAndAll[1].Acc / (stage * 20)) * 100;
    let finalRT = oneAndAll[1].RT_time / oneAndAll[1].RT_count;
    let finalFA = (oneAndAll[1].FA_RT_count / (stage * 6)) * 100;
    let finalFA_RT = oneAndAll[1].FA_RT_time / oneAndAll[1].FA_RT_count;
    let finalScore = oneAndAll[1].Acc;
    if (finalFA_RT == 0) {
      finalFA_RT = "NS";
    }
    this._all = `${finalAcc}_${finalRT}_${finalFA}_${finalFA_RT}_${finalScore}`;
    return this._all;
  }

  async process() {
    let stage = 1;
    let allData = {
      Acc: 0,
      RT_count: 0,
      RT_time: 0,
      FA_RT_count: 0,
      FA_RT_time: 0,
    };
    while (stage < 8) {
      this._oneAndAll = await this._round(stage, allData);
      this._one = this._oneAndAll[0];
      if (this._oneAndAll[2] < 80) {
        break;
      } else if (stage < 7) {
        this._one += "_";
      }
      ++stage;
    }

    this._all += this._allGenerate(this._oneAndAll, stage);

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
