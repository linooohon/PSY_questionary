var cross = document.getElementById("cross");   //initial cross
var finish_btn = document.getElementById("finish_btn")  //the btn to say finish
var body = document.body; //apend item

var BALL_COLOR = {
    R: "red",
    G: "green",
    B: "blue",
    Y: "yellow",
};
var KEY_COLOR = {
    f: "red",
    j: "green",
    s: "blue",
    l: "yellow"
};
var KEY_NUM = {
    f: "2",
    j: "1",
    s: "3",
    l: "4"
}
var COLOR_NUM = {
    "red": "2",
    "green": "1",
    "blue": "3",
    "yellow": "4"
}

class A {
    constructor(game_set) {
        this.game_set = game_set;
        this.ball = original_ball();
        this.ratio = {
            G: game_set / 10 * 7,
            R: game_set / 10 * 3,
        }
        this._question = [];
        this._one = "";
        this._group = [0, 0, 0, 0];//ACC_tRT_FA_tFART
        this._init_item();
        this._createQuestion();
    }
    _init_item() {
        body.appendChild(this.ball);
    }
    _createQuestion() {
        this._question = competitor([BALL_COLOR.G, BALL_COLOR.R], [this.ratio.G, this.ratio.R]);
    }
    _generateAnswer = (item, range_min, range_max) => {
        let start = Date.now();
        let interval = range_min;
        let quetion_Result = "";
        let color = item.style.backgroundColor;
        let group_set = [0, 0, 0, 0];  //ACC_tRT_FA_tFART
        if (range_max != undefined)
            interval = Math.floor(Math.random() * (range_max - range_min)) + range_min;
        quetion_Result += (color[0]).toUpperCase() + "_";   //Color
        show(item);
        return new Promise(resolve => {
            document.addEventListener('keydown', key_handler);
            let timeout = setTimeout(() => {
                document.removeEventListener('keydown', key_handler);
                if (color === BALL_COLOR.R) {
                    group_set[0]++;//GACC
                    quetion_Result += "1_NA~";//OAcc_RT
                } else {
                    quetion_Result += "0_NA~";//OAcc_RT
                }
                hide(item);
                resolve([quetion_Result, group_set]);
            }, interval)
            function key_handler(e) {
                let end = Date.now();
                if (KEY_COLOR[e.key] == color && color === BALL_COLOR.G) {
                    group_set[0]++;//GACC
                    group_set[1] += (end - start);//GRT
                    quetion_Result += "1_" + (end - start).toString() + "~"; //OAcc_RT
                } else {
                    group_set[2]++;//GFA
                    group_set[3] += (end - start);//GFART
                    quetion_Result += "0_" + (end - start).toString() + "~"; //OAcc_RT
                }
                document.removeEventListener('keydown', key_handler);
                hide(item);
                clearTimeout(timeout);
                resolve([quetion_Result, group_set]);
            }
        });
    }
    async process() {
        for (var item of this._question) {
            await collapse(cross, 200, 800); //start
            this.ball.style.backgroundColor = item;
            await this._generateAnswer(this.ball, 2000).then((data) => {
                this._one += data[0];
                this._group = this._group.map((num, idx) => num + data[1][idx]);
            });
            // console.log(this._group);
            await collapse(null, 100, 300);
        }
        //finish process
        finish_btn.click();
    }
    get one() {
        this._one = this._one.slice(0, -1);//remove last~
        return this._one;
    }
    get group() {
        let Acc = (this._group[0] * 100 / this.game_set).toFixed(2);
        let RT = (this._group[1] / this._group[0]).toFixed(2);
        let FA = (this._group[2] * 100 / this.game_set).toFixed(2);
        let FART = (this._group[3] / this._group[2]).toFixed(2);
        return (Acc + "_" + RT + "_" + FA + "_" + FART).replaceAll("NaN", "NA");
    }
}

class B {
    constructor(game_set) {
        this.game_set = game_set;
        this.ball = original_ball();
        this.ratio = game_set / 2;
        this._beenum = Math.round(game_set / 4);//make sure it's integer
        this._question = [];
        this._bee = [];
        this._one = "";
        this._group = [0, 0, 0, 0, 0, 0];//ACC_GoAcc_GoRT_NCRate_NCRT_mSSD
        this._init_item();
        this._createQuestion();
    }
    _init_item() {
        body.appendChild(this.ball);
    }
    _createQuestion() {
        this._question = competitor([BALL_COLOR.G, BALL_COLOR.R], this.ratio);
        this._bee = competitor([1, 0], [this._beenum, this.game_set - this._beenum]);// 1 have bee 0 no bee
        console.log(this._bee);
    }
    _generateAnswer = (item, bee, delay_num, range_min, range_max) => {
        var bee_start = document.getElementById("beestart-btn");
        var bee_stop = document.getElementById("beestop-btn");
        let start = Date.now();
        let interval = range_min;
        let group_set = [0, 0, 0, 0, 0, 0];//ACC_GoAcc_GoRT_NCRate_NCRT_mSSD
        let quetion_Result = "";
        let color = item.style.backgroundColor;
        let plus = 0;
        group_set[5] = delay_num;   //mSSD 
        if (range_max != undefined)
            interval = Math.floor(Math.random() * (range_max - range_min)) + range_min;
        quetion_Result += (color[0]).toUpperCase() + "_"; //Color
        if (bee) {            //CorrAns
            var bee_time = setTimeout(bee_start.click(), delay_num);  //bee start
            quetion_Result += "0_"
        } else {
            quetion_Result += COLOR_NUM[color] + "_";
        }
        show(item);
        return new Promise(resolve => {
            document.addEventListener('keydown', key_handler);
            let timeout = setTimeout(() => {
                document.removeEventListener('keydown', key_handler);
                if (bee) {
                    group_set[0] = 1;//Acc
                    quetion_Result += "0_1_NA_" + delay_num + "_SSAcc~";//Press_Acc_RT_SSD_SSAcc
                    plus = 33;
                    bee_stop.click();
                    clearTimeout(bee_time);
                } else {
                    quetion_Result += "0_0_NA_NA_SSAcc~";//Press_Acc_RT_SSD_SSAcc
                }
                hide(item);
                resolve([quetion_Result, group_set, delay_num + plus]);
            }, interval)
            function key_handler(e) {
                let end = Date.now();
                if (!bee) {
                    if (KEY_COLOR[e.key] == color) {
                        group_set[0] = 1;//Acc
                        group_set[1] = 1;//Go_Acc
                        group_set[2] = end - start;//Go_Rt
                        quetion_Result += KEY_NUM[e.key] + "_1_" + (end - start).toString() + "_NA_SSAcc~";//Press_Acc_RT_SSD_SSAcc
                    } else {
                        quetion_Result += KEY_NUM[e.key] + "_0_" + (end - start).toString() + "_NA_SSAcc~";//Press_Acc_RT_SSD_SSAcc
                    }
                } else {
                    plus = -33;
                    group_set[3] = 1;//NCRate
                    group_set[4] = end - start;//NC_RT
                    quetion_Result += KEY_NUM[e.key] + "_0_" + (end - start).toString() + "_" + bee.toString() + "_SSAcc~";
                    bee_stop.click();
                    clearTimeout(bee_time);
                }
                document.removeEventListener('keydown', key_handler);
                hide(item);
                clearTimeout(timeout);
                resolve([quetion_Result, group_set, delay_num + plus]);
            }
        });
    }
    async process() {
        var delay_num = 200;
        for (var number in this._question) {
            await collapse(cross, 500);
            this.ball.style.backgroundColor = this._question[number];
            var has_bee = this._bee[number];
            await this._generateAnswer(this.ball, has_bee, delay_num, 500).then(
                (data) => {
                    this._one += data[0];
                    this._group = this._group.map((num, idx) => num + data[1][idx]);
                    if (data[2] >= 0 || data[2] <= 450)
                        delay_num = data[2];
                });
            await collapse(null, 100, 300);
            console.log(delay_num);
            // console.log(this._group);
        }
        // console.log(this.one);
        finish_btn.click();
    }
    get one() {
        let Cp = ((this._beenum - this._group[3]) / this._beenum * 100).toFixed(2);
        this._one = this._one.replaceAll("SSAcc", Cp);
        // console.log(Cp,this._beenum,this._group[3]);
        this._one = this._one.slice(0, -1);//remove last~
        return this._one;
    }
    get group() {
        let Acc = (this._group[0] / this.game_set * 100).toFixed(2);
        let Go_Acc = (this._group[1] / (this.game_set - this._beenum) * 100).toFixed(2);
        let Go_Rt = (this._group[2] / this._group[1]).toFixed(2);
        let NcRate = (this._group[3] / this._beenum * 100).toFixed(2);
        let Nc_Rt = (this._group[4] / this._group[3]).toFixed(2);
        let mSSD = (this._group[5] / this._beenum).toFixed(2);
        let SSRT = Go_Rt - mSSD;
        return (Acc + "_" + Go_Acc + "_" + Go_Rt + "_" + NcRate + "_" + Nc_Rt + "_" + mSSD + "_" + SSRT).replaceAll("NaN", "NA");
    }
}
/* class H
3 PART number_set: game_set[part 1,part 2,part 3];
*/
class H {
    constructor(game_set) {
        this.game_set = game_set;
        this.ball = original_ball();
        this.ratio = [game_set[0], game_set[1] / 2, game_set[2] / 4];
        this._question = [];
        this._one = "";
        this._group = [0, 0, 0, 0, 0, 0];
        this._init_item();
        this._createQuestion();
    }
    _init_item() {
        body.appendChild(this.ball);
    }
    _createQuestion() {
        this._question = [
            competitor([BALL_COLOR.G], this.ratio[0]),
            competitor([BALL_COLOR.G, BALL_COLOR.R], this.ratio[1]),
            competitor([BALL_COLOR.G, BALL_COLOR.B, BALL_COLOR.R, BALL_COLOR.Y], this.ratio[2]),
        ]
    }
    _generateAnswer = (item, range_min, range_max) => {
        let start = Date.now();
        let interval = range_min;
        if (range_max != undefined)
            interval = Math.floor(Math.random() * (range_max - range_min)) + range_min;
        let quetion_Result = "";
        let press_and_time = [0, 0];  //  number && times
        var color = item.style.backgroundColor;
        quetion_Result += COLOR_NUM[color] + "_" + COLOR_NUM[color] + "_";//Color_CorrAns_
        show(item);
        return new Promise(resolve => {
            document.addEventListener('keydown', key_handler);
            let timeout = setTimeout(() => {
                document.removeEventListener('keydown', key_handler);
                quetion_Result += "0_NA~";
                hide(item);
                resolve([quetion_Result, press_and_time]);
            }, interval)
            function key_handler(e) {
                let end = Date.now();
                quetion_Result += KEY_NUM[e.key] + "_";//Press_
                if (KEY_NUM.hasOwnProperty(e.key) && KEY_COLOR[e.key] == color) {
                    press_and_time[0] = 1;
                    press_and_time[1] = (end - start);
                    quetion_Result += "1_" + (end - start).toString() + "~"//Acc_RT
                } else {
                    quetion_Result += "0_" + (end - start).toString() + "~";//Acc_RT
                }
                document.removeEventListener('keydown', key_handler);
                hide(item);
                clearTimeout(timeout);
                // console.log(quetion_Result);
                resolve([quetion_Result, press_and_time]);
            }
        });
    }
    async process() {
        for (let part = 0; part < this._question.length; ++part) {
            let numbertimeset = [0, 0];
            for (var item of this._question[part]) {
                await collapse(cross, 200, 800); //start
                this.ball.style.backgroundColor = item;
                await this._generateAnswer(this.ball, 500).then((data) => {
                    this._one += data[0];
                    numbertimeset[0] += data[1][0];
                    numbertimeset[1] += data[1][1];
                });
                await collapse(null, 100, 300);
            }
            this._one = this._one.slice(0, -1) + "-";//change part
            this._group[part] = numbertimeset[0] * 100 / this.game_set[part];//Acc
            this._group[part + 3] = numbertimeset[1] / numbertimeset[0];//Rt
            // console.log(this._group);
        }
        //finish process
        finish_btn.click();
        // console.log(this.group);
    }
    get one() {
        this._one = this._one.slice(0, -1);//remove last~
        return this._one;
    }
    get group() {
        let Acc1 = this._group[0].toString();
        let Acc2 = this._group[1].toString();
        let Acc3 = this._group[2].toString();
        let RT1 = this._group[3].toString();
        let RT2 = this._group[4].toString();
        let RT3 = this._group[5].toString();
        return (Acc1 + "_" + Acc2 + "_" + Acc3 + "_" + RT1 + "_" + RT2 + "_" + RT3).replaceAll('NaN', 'NA');
    }
}

/* I set array of game_set//number_length 
ex: [3,[4]]  //[3,[5,6,7,8,9]]*/
class I {
    constructor(game_set) {
        this.each_game = game_set[0];
        this.ratio = game_set[1];
        this.number = document.createElement("label");
        this.inputline = document.getElementById('input-div').children;
        this._question = [];
        this._one = "";
        this._group = [0, 0];//Score_Total
        this._init_item();
        this._createQuestion();
    }
    _init_item() {
        this.number.setAttribute("style", "font-size: 28px; font-weight: bold;");
        this.number.textContent = "1";
        this.number.classList.add('center-screen');
        body.appendChild(this.number);
    }
    _createQuestion() {
        for (var question = 0; question < this.ratio.length; ++question) {
            for (var len = 0; len < this.each_game; ++len) {
                var tmp = [];
                for (var number_len = 0; number_len < this.ratio[question]; ++number_len) {
                    tmp.push(Math.floor(Math.random() * 9) + 1);
                    this._group[1]++;
                }
                this._question.push(tmp);
            }
        }
        // console.log(this._group[1]);
    }
    _generateAnswer(numberlist, inputline, interval) {
        var quetion_Result = "";
        let length = numberlist.length;
        let start = Date.now();
        quetion_Result += length.toString() + "_";//NofDig
        for (let i = 0; i < length; ++i) {     //show item
            quetion_Result += numberlist[i].toString(); //CorrDig
            show(inputline[i]);
        }
        quetion_Result += "_";
        return new Promise(resolve => {
            var typenum = 0;
            var sum = 0;
            var keylist = [];
            document.addEventListener('keydown', key_handler);
            function stopRun() {
                let end = Date.now();
                quetion_Result += "_";
                document.removeEventListener('keydown', key_handler);
                for (let i = 0; i < length; ++i) {         // hide object
                    hide(inputline[i]);
                    inputline[i].textContent = "_";
                    if (keylist.length >= i) {
                        let right = 0;
                        if (keylist[i] == numberlist[i])     //set not finish system
                            right = 1;
                        quetion_Result += right.toString();
                        sum += right;
                    }
                }
                quetion_Result += "_" + sum + "_" + (end - start).toString() + "~";
                // console.log(quetion_Result);
                resolve([quetion_Result, sum]);      // return resolve
            }
            let timeout = setTimeout(() => {
                stopRun();
            }, interval)
            function key_handler(e) {
                if (typenum >= length && e.key == "Enter") {
                    clearTimeout(timeout);
                    stopRun();
                } else if (typenum < length && parseInt(e.key)) {
                    keylist.push(e.key);
                    inputline[typenum++].textContent = e.key;
                    quetion_Result += e.key.toString(); //Press_Dig
                }
            }
        });
    }
    async process() {
        // console.log(this._question);
        for (var part in this._question) {
            await collapse(cross, 1000);  //start
            for (var item of this._question[part]) {
                this.number.textContent = item;
                await collapse(this.number, 1000);
                await collapse(null, 200);
            }
            await this._generateAnswer(this._question[part].reverse(), this.inputline, 15000).then((data) => {
                this._one += data[0]; this._group[0] += data[1];
            });
            console.log(this._group[0]);
        }
        //finish process
        finish_btn.click();
    }
    get one() {
        return this._one;
    }
    get group() {
        let Score = this._group[0];
        let Acc = this._group[0] / this._group[1] * 100;
        return (Score + "_" + Acc).replaceAll("NaN", "NA");
    }
}
/*dont have jpg temporary replace it with ball*/
class K {
    constructor(game_set) {
        this.game_set = game_set;
        this.word = document.createElement("label");
        //this.ball = original_ball();
        this.ratio = game_set / 4;
        this.question = [];
        this._one = "";
        this._group_time = [0, 0, 0, 0];
        this._group = [0, 0, 0, 0, 0];//Acc_RT_Positive_Negative_Middle
        this._worddict = [
            ["快活", "著迷", "幸福", "暢快", "期待", "開心", "愉快", "喜歡", "高興", "雀躍"],//positive
            ["害怕", "痛心", "驚慌", "恐懼", "痛苦", "氣憤", "恐怖", "焦躁", "生氣", "著急"],  //negative
            ["作業", "握拳", "結束", "雨天", "空白", "成績", "發呆", "花錢", "打牌", "早起"]];//middle
        this._init_item();
        this._createQuestion();
    }
    _init_item() {
        this.word.setAttribute("style", "font-size: 60px; font-weight: bold; display: none;");
        this.word.textContent = "快樂";//test code
        this.word.setAttribute("part", "");//set type of color
        // this.word.style.backgroundColor="rgb(125,125,125)";
        this.word.classList.add('center-screen');
        body.appendChild(this.word);
    }
    _createQuestion() {
        let wordlength = this._worddict[0].length;
        let wordkind = this._worddict.length;
        for (var colortype of Object.values(BALL_COLOR)) {
            for (let kind = 0; kind < wordkind; ++kind) {
                for (let i = 0; i < wordlength; ++i) {
                    this.question.push([this._worddict[kind][i], colortype, kind]);//word color kind
                }
            }

        }
        this.question = competitor(this.question, 1);
        console.log(this.question);
        // this.word.style.color = BALL_COLOR[this.question[0][1]] ;
        // this.word.setAttribute("part",this.question[0][1]);
        // this.word.textContent=this.question[0][0];
        // console.log(this.word);
        // this.wordlist = competitor([1, 2, 3],1);
    }
    _generateAnswer = (item, range_min, range_max) => {
        let interval = range_min;
        if (range_max != undefined)
            interval = Math.floor(Math.random() * (range_max - range_min)) + range_min;
        let start = Date.now();
        let color = item.style.color;
        let condition = item.getAttribute("part");
        let quetion_Result = "";
        let group_time = [0, 0, 0, 0];
        let group_set = [0, 0, 0, 0, 0];//Acc_RT_tPositive_tNegative_tMiddle
        quetion_Result += condition + '_';//Condition
        quetion_Result += item.textContent + "_"; //Pic_text

        quetion_Result += COLOR_NUM[color] + "_";//Color
        show(item);
        return new Promise(resolve => {
            document.addEventListener('keydown', key_handler);
            let timeout = setTimeout(() => {    //if time out
                document.removeEventListener('keydown', key_handler);
                quetion_Result += "NA_-1~";  //no input
                hide(item);
                resolve([quetion_Result, group_set, group_time]);
            }, interval)
            function key_handler(e) {
                let end = Date.now();
                quetion_Result += KEY_NUM[e.key] + "_";//Press
                // console.log(e.key);
                if (KEY_COLOR[e.key] == color) {
                    group_time[condition] = 1;
                    group_set[0] = 1;  //ACC
                    group_set[1] = (end - start);  //RT
                    group_set[condition + 1] = (end - start);  //PNM
                    quetion_Result += "1_" + (end - start).toString() + "~" //ACC_RT
                } else {
                    quetion_Result += "0_" + (end - start).toString() + "~";
                }
                document.removeEventListener('keydown', key_handler);
                hide(item);
                clearTimeout(timeout);
                resolve([quetion_Result, group_set, group_time]);
            }
        });
    }
    async process() {
        for (var number in this.question) {
            await collapse(cross, 1000); //start
            this.word.textContent = this.question[number][0];
            this.word.style.color = this.question[number][1];
            this.word.setAttribute("part", this.question[number][2]);
            await this._generateAnswer(this.word, 3000).then((data) => {
                this._one += data[0]; //add the one
                this._group = this._group.map(function (num, idx) { //add the group
                    return num + data[1][idx];
                });
                this._group_time = this._group_time.map(function (num, idx) { //add the group_time
                    return num + data[2][idx];
                });
            });
            // console.log(this._one);
            // console.log(this._group);
            // console.log(this._group_time);
            await collapse(null, 100, 300);
        }
        // console.log(this.group);
        //finish process
        finish_btn.click();
        // console.log(this.one);
        // console.log(this.group);
    }
    get one() {
        this._one = this._one.slice(0, -1);//remove last~
        return this._one;
    }
    get group() {
        let Acc = (this._group[0] * 100 / this.game_set).toFixed(2);
        let RT = (this._group[1] / this._group[0]).toFixed(2);
        let Positive = (this._group[2] / this._group_time[1]).toFixed(2);
        let Negative = (this._group[3] / this._group_time[2]).toFixed(2);
        let Middle = (this._group[4] / this._group_time[3]).toFixed(2);
        return (Acc + "_" + RT + "_" + Positive + "_" + Negative + "_" + Middle).replaceAll("NaN", "NA");
    }
}

/*collapse function (show in specific interval then hide)
* obj=> items
* range_min:time interval 
* range_max:if it exist, than interval will between(min-max)
*/
const collapse = (obj, range_min, range_max) => {
    if (obj != null)
        show(obj);
    let interval = range_min;
    if (range_max != undefined)
        interval = Math.floor(Math.random() * (range_max - range_min)) + range_min;
    return new Promise(resolve => {
        setTimeout(() => {
            hide(obj);
            resolve();
        }, interval)
    });
}

//ratio Number divide equally  else  Array give ratio list
function competitor(object_list, ratio = null) {
    var arr = [];
    if (typeof (ratio) === 'number') {
        for (number = 0; number < object_list.length; ++number) {
            for (var i = 0; i < ratio; ++i)
                arr.push(object_list[number]);
        }
    } else {
        for (var number in ratio) {
            let each_length = ratio[number];
            for (i = 0; i < each_length; ++i)
                arr.push(object_list[number]);
        }
    }
    arr = shuffle(arr);
    return arr;
}

//shuffle the array
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

//center_ball object
var ball = {
    class: [
        'ball-me',
        'center-screen',
    ],
}

//create the center_ball object 
var original_ball = function () {
    let obj = document.createElement("ball");
    for (var key in ball) {
        if (key === "class") {
            for (var classname in ball[key]) {
                obj.classList.add(ball[key][classname]);
                console.log(ball[key][classname]);
            }
        }
    }
    return obj;
}

//hide object 
function hide(obj) {
    if (obj != null)
        obj.style.display = "none";
}

//show object
function show(obj) {
    if (obj != null)
        obj.style.display = "inline-block";
}
