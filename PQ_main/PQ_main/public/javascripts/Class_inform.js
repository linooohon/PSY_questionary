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
var ARROW_NUM = {
    "ArrowRight": "1",
    "ArrowDown": "2",
    "ArrowLeft": "3",
    "ArrowUp": "4"
}
class A {
    constructor(game_set) {
        this.game_set = game_set;
        this.ball = add_ball(['ball-80', 'center-screen']);
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
            document.addEventListener('keydown', key_handler, { once: true });
            let timeout = setTimeout(() => {
                //document.removeEventListener('keydown', key_handler);
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
                console.log(e.key);
                if (KEY_COLOR[e.key] == color && color === BALL_COLOR.G) {
                    group_set[0]++;//GACC
                    group_set[1] += (end - start);//GRT
                    quetion_Result += "1_" + (end - start).toString() + "~"; //OAcc_RT
                } else {
                    group_set[2]++;//GFA
                    group_set[3] += (end - start);//GFART
                    quetion_Result += "0_" + (end - start).toString() + "~"; //OAcc_RT
                }
                // document.removeEventListener('keydown', key_handler);
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
        let one = this._one.slice(0, -1);//remove last~
        return one;
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
        this.ball = add_ball(['ball-80', 'center-screen']);
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
            document.addEventListener('keydown', key_handler, { once: true });
            let timeout = setTimeout(() => {
                // document.removeEventListener('keydown', key_handler);
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
                // document.removeEventListener('keydown', key_handler);
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
            console.log(this._one);
            console.log(this._group);
        }
        // console.log(this.one);
        finish_btn.click();
    }
    get one() {
        let Cp = ((this._beenum - this._group[3]) / this._beenum * 100).toFixed(2);
        this._one = this._one.replaceAll("SSAcc", Cp);
        // console.log(Cp,this._beenum,this._group[3]);
        let one = this._one.slice(0, -1);//remove last~
        return one;
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

//20 + (±1)(41-n)(0.4 + 0.1k)   20%[起始] +(-)[對就減少,錯增加] 1 * (41 - n[第幾題]) * (0.4 + 0.1 * k[目前連對或連錯幾題])
class C {
    constructor(game_set) {
        this.game_set = game_set;
        this.spawn_div = document.getElementById("spawn");
        this._question = [];
        this._one = "";
        this.ballnum = 500;
        this._whole = this.ballnum * 0.2
        this._group = [0, 0, 0, 0, 0, 0];
        this._init_item();
        this._createQuestion();
        this.DIRECTION = {
            1: 'right',
            2: 'down',
            3: 'left',
            4: 'up',
        }
        this.run = document.querySelector('button[name="ballrun"]');
        this.renew = document.querySelector('button[name="ballrenew"]');
    }
    _init_item() {

    }
    _createQuestion(correct, num, conti) {
        return this._whole + correct * (41 - num) * (0.4 + 0.1 * conti);
    }
    _generateAnswer = (item, direction, range_min, range_max) => {
        let start = Date.now();
        let interval = range_min;
        let quetion_Result = "";
        let group_set = 0;
        if (range_max != undefined)
            interval = Math.floor(Math.random() * (range_max - range_min)) + range_min;
        show(item);
        return new Promise(resolve => {
            document.addEventListener('keydown', key_handler, { once: true });
            let timeout = setTimeout(() => {
                quetion_Result += "NA_0_" + direction + "_NA~";
                hide(item);
                resolve([quetion_Result, group_set]);
            }, interval)
            function key_handler(e) {
                let end = Date.now();
                if (ARROW_NUM[e.key] == direction) {
                    group_set = 1;
                } quetion_Result += (end - start) + "_" + group_set + "_" + direction + "_" + ARROW_NUM[e.key] + "~";
                hide(item);
                clearTimeout(timeout);
                resolve([quetion_Result, group_set]);
            }
        });
    }
    async process() {
        for (let session = 0; session < this.game_set[0]; ++session) {
            let part_right = 0;
            let ratio = this.ballnum * 0.2;
            let flip = 0;
            let conti = 0;
            for (let i = 0; i < this.game_set[1]; ++i) {
                let direction = Math.floor(Math.random() * 4) + 1;//1 to 4
                for (let d = 0; d < this.ballnum; ++d) {
                    if (d < ratio) {
                        this.spawn_div.children[d].setAttribute('direction', this.DIRECTION[direction]);
                    } else {
                        this.spawn_div.children[d].setAttribute('direction', 'random');
                    }
                }
                this.renew.click();
                this._one += ratio + "_";
                await collapse(cross, 1000); //start 
                this.run.click();
                await collapse(this.spawn_div, 500);
                console.log(ratio);
                console.log(direction);
                await this._generateAnswer(null, direction, 8000).then((data) => {
                    this._one += data[0];
                    part_right += data[1];
                    flip == data[1] ? conti++ : conti = 0;
                    flip = data[1];
                });
                this._one = this._one.slice(0, -1) + "-";//change session
                flip == 0 ? ratio = this._createQuestion(1, i, conti) : ratio = this._createQuestion(-1, i, conti);
            }
            console.log(part_right);
            this._group[session] = part_right;
            this._group[session + 3] = ratio;
            await new Promise(resolve => {
                function keyhandle(e) {
                    if (e.key == " ") {
                        window.removeEventListener('keydown', keyhandle);
                        resolve();
                    }
                }
                window.addEventListener('keydown', keyhandle);//once true ,the listener will be remove after invoke      
            });
            console.log(this._group);
            console.log("next");
        }
        // console.log(this.one);
        // console.log(this.group);
        //finish process
        finish_btn.click();

    }
    get one() {
        let one = this._one.slice(0, -1);//remove last~
        return one;
    }
    get group() {
        let R1 = (this._group[0] * 100 / this.game_set[1]).toFixed(2);
        let R2 = (this._group[1] * 100 / this.game_set[1]).toFixed(2);
        let R3 = (this._group[2] * 100 / this.game_set[1]).toFixed(2);
        let CR1 = (this._group[3] * 100 / this.ballnum).toFixed(2);
        let CR2 = (this._group[4] * 100 / this.ballnum).toFixed(2);
        let CR3 = (this._group[5] * 100 / this.ballnum).toFixed(2);
        return (R1 + "_" + R2 + "_" + R3 + "_" + CR1 + "_" + CR2 + "_" + CR3).replaceAll("NaN", "NA");
    }
}

class D {
    constructor(game_set) {
        this.game_set = game_set;
        this.ratio = {
            G: game_set / 10 * 7,
            R: game_set / 10 * 3,
        }
        this.garbor = document.getElementById("garbordiv");
        this._question = [];
        this.garborsize = [20, 60, 200];
        this.direction = ["MOVE-Right", "MOVE-Left"];
        this.averagebox = [0, 0, 0];
        this.correct = 0;
        this.tmp = [];
        this.timer = 500;
        this._one = "";
        this._group = "";
        this._init_item();
        this._createQuestion();
    }
    _init_item() {
    }
    _createQuestion() {
        for (let i = 0; i < this.game_set[0]; ++i) {
            var tmp = [];
            for (let j = 0; j < this.game_set[1]; ++j) {
                tmp.push([Math.floor(Math.random() * 3), Math.floor(Math.random() * 2)]);
            }
            this._question.push(tmp);
        }
    }
    _generateAnswer = (direction, range_min, range_max) => {
        // let start = Date.now();
        let interval = range_min;
        let quetion_Result = "";
        if (range_max != undefined)
            interval = Math.floor(Math.random() * (range_max - range_min)) + range_min;
        return new Promise(resolve => {
            document.addEventListener('keydown', key_handler, { once: true });
            let timeout = setTimeout(() => {
                quetion_Result += "NA_0~";
                resolve([quetion_Result, 0]);
            }, interval)
            function key_handler(e) {
                // let end = Date.now();
                if (KEY_NUM[e.key] == direction.toString()) {
                    quetion_Result += KEY_NUM[e.key] + "_1~";
                    clearTimeout(timeout);
                    resolve([quetion_Result, 1]);
                } else {
                    quetion_Result += KEY_NUM[e.key] + "_0~"
                    clearTimeout(timeout);
                    resolve([quetion_Result, 0]);
                }
            }
        });
    }
    async process() {
        for (let i = 0; i < this._question.length; ++i) {
            console.log("start_now");
            this.timer = 500;
            let part = [0, 0, 0, 0, 0, 0, 0, 0, 0];//lar t1 t2 t3
            for (var item of this._question[i]) {//size direction
                this.tmp = item;
                await collapse(cross, 300); //start
                document.documentElement.style.setProperty('--size', this.garborsize[item[0]] + 'px');
                document.documentElement.style.setProperty('--move-direction', this.direction[item[1]]);
                this.garbor.setAttribute("style", "top:" + (window.innerHeight - this.garborsize[item[0]]) / 2 + "px;" + "left:" + (window.innerWidth - this.garborsize[item[0]]) / 2 + "px");
                await collapse(this.garbor, this.timer);
                this._one += (item[0] + 1) + "_" + this.timer + "_" + (item[1] + 1) + "_";//size pre direction
                await this._generateAnswer(item[1] + 1, 5000).then((data) => {
                    this._one += data[0];
                    this.correct = data[1];
                    this.correct == 0 ? this.timer = this.timer + (500) * 0.3 + 100 : this.timer = this.timer + (-500) * 0.3 + 100;
                    part[this.tmp[0]]++;
                    part[this.tmp[0] + 6] = this.timer;
                    if (this.correct != 0) {
                        part[this.tmp[0] + 3]++;
                    }
                });
            }
            this._one = this._one.slice(0, -1) + "-";
            this.averagebox[0] += part[6];
            this.averagebox[1] += part[7];
            this.averagebox[2] += part[8];
            this._group += part[6] + "_" + part[7] + "_" + part[8] + (part[3] / part[0] * 100).toFixed(2) + "_"
                + (part[4] / part[1] * 100).toFixed(2) + "_" + (part[5] / part[2] * 100).toFixed(2) + "_";
            await new Promise(resolve => {
                window.addEventListener('keydown', e => { console.log(e.key); if (e.key == " ") { console.log(" oh ya"); resolve(); } console.log("press space") });//once true ,the listener will be remove after invoke
            });
            // console.log(this._one);
            // console.log(this.averagebox);
            // console.log(this._group);
        }
        //finish process
        finish_btn.click();
        // console.log(this.one);
        // console.log(this.group);
    }
    get one() {
        let one = this._one.slice(0, -1);//remove last~
        return this._one.replaceAll("NaN", "NA");
    }
    get group() {
        this._group += (this.averagebox[0] / 3).toFixed(2) + "_" + (this.averagebox[1] / 3).toFixed(2) + "_" + (this.averagebox[2] / 3).toFixed(2);
        return this._group.replaceAll("NaN", "NA");
    }
}
class E {
    constructor(game_set) {
        this.game_set = game_set;
        this.SIDE = {
            0: 'upper',
            1: 'downer'
        }
        this.arrowplace = document.getElementById("arrow_place").children;//0-2 right 3-5 left c i n
        this.clueplace = document.getElementById("clue_place").children;//N0 C1 D2 S3
        this._question = [];
        this._one = "";
        this._group = [0, 0, 0, 0, 0, 0, 0, 0];//rt-space*4-arrow*3
        this._group_num = [0, 0, 0, 0, 0, 0, 0, 0];//accspace*4-arrow*3
        this._createQuestion();
        console.log(this._question);
    }
    _init_item() {
    }
    _createQuestion() {
        let spartial = 0;
        while (1) {
            for (let cluek = 0; cluek < 3; ++cluek) {//no spartial
                for (let arrowk = 0; arrowk < 3; ++arrowk) {
                    for (let side = 0; side < 2; ++side) {
                        for (let tag = 0; tag < 2; ++tag) {
                            this._question.push([cluek, arrowk, side, tag]);
                            if (this._question.length >= this.game_set) {
                                shuffle(this._question);
                                return;
                            }
                        }
                    }
                }
            }
            for (let arrowk = 0; arrowk < 3; ++arrowk) {    //spartial side  
                for (let tag = 0; tag < 2; ++tag) {
                    this._question.push([3, arrowk, spartial, tag]);
                    if (this._question.length >= this.game_set) {
                        shuffle(this._question);
                        return;
                    }
                }
            }
            spartial++;
        }

    }
    _generateAnswer = (item, direction, range_min, range_max) => {
        let start = Date.now();
        let interval = range_min;
        let quetion_Result = "";
        let group_set = [0, 0];
        if (range_max != undefined)
            interval = Math.floor(Math.random() * (range_max - range_min)) + range_min;
        show(item);
        return new Promise(resolve => {
            document.addEventListener('keydown', key_handler, { once: true });
            let timeout = setTimeout(() => {
                quetion_Result += "0_0_1700~";//press-acc-rt
                group_set = [0, 1700];
                hide(item);
                resolve([quetion_Result, group_set]);
            }, interval)
            function key_handler(e) {
                let end = Date.now();
                if (KEY_NUM[e.key] == (direction + 1).toString()) {
                    quetion_Result += KEY_NUM[e.key] + "_1_" + (end - start).toString() + "~";//press-acc-rt
                    group_set = [1, end - start];
                } else {
                    quetion_Result += KEY_NUM[e.key] + "_0_" + (end - start).toString() + "~";//press-acc-rt
                    group_set = [0, end - start];
                }
                hide(item);
                clearTimeout(timeout);
                resolve([quetion_Result, group_set]);
            }
        });
    }
    async process() {
        for (var item of this._question) {//[cluek,arrowk,side,tag]
            let getgroup = [];
            let cross_time = Math.floor(Math.random() * 10) + 400;
            await collapse(cross, cross_time); //start
            if (item[0] == 3) {
                this.clueplace[item[0]].setAttribute("side", this.SIDE[item[2]]);
            }
            console.log(this.clueplace[item[0]]);
            await collapse(this.clueplace[item[0]], 1000);  //collapse something
            this.clueplace[item[0]].removeAttribute("side");
            await collapse(cross, 400);

            this._one += (item[0] + 1) + "_" + (item[1] + 1) + "_" + (item[2] + 1) + "_" + (item[3] + 1) + "_";//cue-con-pos-ori-
            //nci + right or left
            this.arrowplace[item[1] + item[3] * 3].setAttribute("side", this.SIDE[item[2]]);
            await this._generateAnswer(this.arrowplace[item[1] + item[3] * 3], item[3], 1700).then((data) => {
                this._one += data[0];
                getgroup = data[1];
            });
            this.arrowplace[item[1] + item[3] * 3].removeAttribute("side");
            if (getgroup[0]) {
                this._group_num[0] += getgroup[0];//acc rt
                this._group[0] += getgroup[1];
                this._group_num[1 + item[0]] += getgroup[0];//space
                this._group[1 + item[0]] += getgroup[1];
                this._group_num[5 + item[1]] += getgroup[0];//arror
                this._group[5 + item[1]] += getgroup[1];
            }
            // console.log(item);
            // console.log(this._one);
            // console.log(this._group);
            // console.log(this._group_num);
            await collapse(null, 3500 - cross_time - getgroup[1]);
        }
        //finish process
        finish_btn.click();
        console.log(this.one);
        console.log(this.group);
    }
    get one() {
        let one = this._one.slice(0, -1);//remove last~
        return one;
    }
    get group() {
        let Acc = (this._group_num[0] * 100 / this.game_set).toFixed(2);
        let RT = (this._group[0] / this._group_num[0]).toFixed(2);
        let No = (this._group[1] / this._group_num[1]).toFixed(2);
        let Ce = (this._group[2] / this._group_num[2]).toFixed(2);
        let Du = (this._group[3] / this._group_num[3]).toFixed(2);
        let Sp = (this._group[4] / this._group_num[4]).toFixed(2);
        let Co = (this._group[5] / this._group_num[5]).toFixed(2);
        let In = (this._group[6] / this._group_num[6]).toFixed(2);
        let Ne = (this._group[7] / this._group_num[7]).toFixed(2);
        let Al = No - Du;
        let Or = Ce - Sp;
        let Conflict = In - Co;
        return (Acc + "_" + RT + "_" + No + "_" + Ce + "_" + Du + "_" + Sp + "_" + Co + "_" + In + "_" + Ne + "_" + Al + "_" + Or + "_" + Conflict).replaceAll("NaN", "NA");
    }
}

class F {
    constructor(game_set) {
        this.game_set = game_set;
        this.SoA = [50, 1050];
        this._question = [];//[eys,rectplace,second]
        this.pic = document.getElementById("image");
        this._one = "";
        this._group = [0, 0, 0, 0, 0, 0];
        this._group_num = [0, 0, 0, 0, 0, 0];
        this.IMG_NAME = {
            0: "/pic/eye.jpg",
            1: "/pic/eye_L.jpg",
            2: "/pic/eye_R.jpg",
        }
        this.rect = document.getElementById("rect_div").children;//0:left ,1:right
        this._createQuestion();
    }
    _init_item() {
    }
    _createQuestion() {//gameset length
        // console.log(this.game_set);
        while (1) {
            for (let eye = 0; eye < 3; ++eye) {
                for (let place = 0; place < 2; ++place) {
                    for (var second of this.SoA) {
                        if (eye == 0) {
                            this._question.push([eye, place, second, 1]);
                        } else if (eye == place) {
                            this._question.push([eye, place, second, 2]);
                        } else {
                            this._question.push([eye, place, second, 3]);
                        }
                        if (this._question.length >= this.game_set) {//make it correct size
                            shuffle(this._question);
                            console.log(this._question);
                            return;
                        }
                    }
                }
            }
        }

    }
    _generateAnswer = (item, targetposition, range_min, range_max) => {
        let start = Date.now();
        let interval = range_min;
        let quetion_Result = "";
        let group_set = [0, 0];//Acc_Rt
        if (range_max != undefined)
            interval = Math.floor(Math.random() * (range_max - range_min)) + range_min;
        show(item);
        return new Promise(resolve => {
            document.addEventListener('keydown', key_handler, { once: true });
            let timeout = setTimeout(() => {
                quetion_Result += "0_2_NA~" //Press_Acc_RT
                group_set = [0, 0];
                hide(item);
                resolve([quetion_Result, group_set]);
            }, interval)
            function key_handler(e) {
                let end = Date.now();
                let Direction_Num = {
                    f: 0,
                    j: 1,
                }
                targetposition == Direction_Num[e.key] ? group_set = [1, end - start] : group_set = [0, end - start];
                if (group_set[0] == 0) {
                    quetion_Result += KEY_NUM[e.key] + "_2_" + group_set[1] + "~"//Press_Acc_RT
                    group_set = [0, 0];
                } else {
                    quetion_Result += KEY_NUM[e.key] + "_1_" + group_set[1] + "~"//Press_Acc_RT
                }
                hide(item);
                clearTimeout(timeout);
                resolve([quetion_Result, group_set]);
            }
        });
    }
    async process() {
        for (var item of this._question) {
            let get_group = "";
            await collapse(cross, 1000); //start
            this.pic.src = this.IMG_NAME[0];
            await collapse(this.pic, 1000); //eye
            this.pic.src = this.IMG_NAME[item[0]];
            await collapse(this.pic, 150);//look
            this.pic.src = this.IMG_NAME[0]; //eye
            await collapse(this.pic, item[2]);
            this._one += item[3] + "_" + (item[2] + 150) + "_" + (item[1] + 1).toString() + "_";//Cue-Soa-pos
            await this._generateAnswer([this.pic, this.rect[item[1]]], item[1], 800).then((data) => {
                this._one += data[0];
                get_group = data[1];
            });
            this._group_num[0] += get_group[0];
            this._group[0] += get_group[1];
            this._group_num[item[3]] += get_group[0];
            this._group[item[3]] += get_group[1];
            if (item[2] == 50) {
                this._group_num[4] += get_group[0];
                this._group[5] += get_group[1];
            } else {
                this._group_num[5] += get_group[0];
                this._group[5] += get_group[1];
            }
            // console.log(this._group);
            // console.log(this._group_num);
        }
        //finish process
        finish_btn.click();
    }
    get one() {
        let one = this._one.slice(0, -1);//remove last~
        return one;
    }
    get group() {
        let Acc = (this._group_num[0] * 100 / this.game_set).toFixed(2);
        let RT = (this._group[0] / this._group_num[0]).toFixed(2);
        let Ne = (this._group[1] / this._group_num[1]).toFixed(2);
        let Co = (this._group[2] / this._group_num[2]).toFixed(2);
        let Ico = (this._group[3] / this._group_num[3]).toFixed(2);
        let Soa200 = (this._group[4] / this._group_num[4]).toFixed(2);
        let Soa1200 = (this._group[5] / this._group_num[5]).toFixed(2);
        return (Acc + "_" + RT + "_" + Ne + "_" + Co + "_" + Ico + "_" + Soa200 + "_" + Soa1200).replaceAll("NaN", "NA");
    }
}


// questionlength
class G {
    constructor(game_set, haslevel = false) {
        this.haslevel = haslevel;
        this.game_set = game_set;
        this._score = 0;
        this._click = 3;
        this._level = 6;
        this._one = "";
        this.spawn_div = document.getElementById("spawn");
        this.run = document.querySelector('button[name="ballrun"]');
        this.pause = document.querySelector('button[name="ballpause"]');
        this.renew = document.querySelector('button[name="ballrenew"]');
        this.addball = document.querySelector('button[name="balladd"]');
    }
    _init_item() {
    }
    _createQuestion() {
    }
    _generateAnswer = () => {
    }
    async process() {
        for (; ; this._level++) {
            let session_score = 0;
            for (let length = 0; length < this.game_set; ++length) {
                this.renew.click();
                await collapse(cross, 1000);                //cross
                show(this.spawn_div);
                await new Promise(resolve => {
                    window.addEventListener('keydown', e => {    //start run
                        if (e.key == " ") {
                            for (let i = 0; i < this._click; ++i) {
                                this.spawn_div.childNodes[i].classList.remove('blink');
                                this.spawn_div.childNodes[i].style.backgroundColor="rgb(0,0,100)";
                                this.spawn_div.childNodes[i].classList.add('enable_click');
                            }
                            this.run.click();
                            resolve();
                        }
                    }, { once: true });//once true ,the listener will be remove after invoke
                });
                await collapse(null, 5000);          //move
                this.pause.click();
                await new Promise(resolve => { //wait for player click
                    let num = 0;
                    let partscore = 0;
                    document.addEventListener('click', mouseclick);
                    function mouseclick(event) {
                        num++;
                        console.log(event.target.tagName);
                        if (event.target.tagName == "TARGET" && event.target.classList.contains('enable_click')) {
                            partscore++;
                            event.target.classList.remove('enable_click');
                        }
                        if (num >= 3) {
                            document.removeEventListener('click', mouseclick);
                            session_score += partscore;
                            console.log(partscore);
                            resolve(partscore);
                        }
                    }
                }).then(partscore => this._one += partscore + "~");
                hide(this.spawn_div);
                for (let i = 0; i < this._click; ++i) {
                    this.spawn_div.childNodes[i].classList.add('blink');
                    this.spawn_div.childNodes[i].style.backgroundColor="yellow";
                    this.spawn_div.childNodes[i].classList.add('enable_click');
                }
            }
            this._score += session_score;
            if (session_score < 10 || !this.haslevel) {
                break;
            } else {
                this.addball.click();
            }
        }
        // console.log(this.one);
        // console.log(this.group);
        //finish process
        finish_btn.click();
    }
    get one() {
        let one = this._one.slice(0, -1);//remove last~
        return one;
    }
    get group() {
        let Acc = (this._score * 100 / ((this._level - 5) * 4 * 3)).toFixed(2);
        console.log((this._level - 5) * 4 * 3);
        return (this._level + "_" + this._score + "_" + Acc).replaceAll("NaN", "NA");
    }
}

/* class H
3 PART number_set: game_set[part 1,part 2,part 3];
*/
class H {
    constructor(game_set) {
        this.game_set = game_set;
        this.ball = add_ball(['ball-80', 'center-screen']);
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
            document.addEventListener('keydown', key_handler, { once: true });
            let timeout = setTimeout(() => {
                // document.removeEventListener('keydown', key_handler);
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
                // document.removeEventListener('keydown', key_handler);
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
        let one = this._one.slice(0, -1);//remove last~
        return one;
    }
    get group() {
        let Acc1 = this._group[0].toFixed(2).toString();
        let Acc2 = this._group[1].toFixed(2).toString();
        let Acc3 = this._group[2].toFixed(2).toString();
        let RT1 = this._group[3].toFixed(2).toString();
        let RT2 = this._group[4].toFixed(2).toString();
        let RT3 = this._group[5].toFixed(2).toString();
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
                for (let i = 0; i < length - typenum; ++i) {
                    quetion_Result += "X";
                }
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
            await this._generateAnswer(this._question[part].reverse(), this.inputline, 3000).then((data) => {
                this._one += data[0]; this._group[0] += data[1];
            });
            console.log(this._one);
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

//N 
class J {
    constructor(game_set, practice = false) {
        this.game_set = game_set;
        this._question = [];
        this._one = "";
        this._group = [];
        this._total = 0;
        this._level = 2;
        this.nine_grid = document.getElementById("nine-grid");
        this._init_item();
        this._createQuestion(2);
        this.practice = practice;
    }
    _init_item() {
        console.log(this.nine_grid);
    }
    _createQuestion(number) {
        let tmp = [];//number- give press sign -need press
        for (let i = 0; i < this.game_set; ++i) {
            if (i < this.game_set / 3) {
                tmp.push([Math.floor(Math.random() * 9) + 1, true, false]);
            } else {
                tmp.push([Math.floor(Math.random() * 9) + 1, false, false])
            }
        }
        shuffle(tmp);
        //last numbers
        for (let i = 0; i < number; ++i) {
            tmp.push([Math.floor(Math.random() * 9) + 1, false]);
        }
        //create question
        for (let i = 0; i < tmp.length; ++i) {
            if (tmp[i].length > 2) {
                if (tmp[i][1] == true) {
                    tmp[i + number] = [tmp[i][0], true];
                }
                tmp[i] = [tmp[i][0], false];
            }
        }
        return tmp;
    }
    _generateAnswer = (item, press, range_min, range_max) => {
        let interval = range_min;
        let quetion_Result = "";
        let group_set = 0;
        if (range_max != undefined)
            interval = Math.floor(Math.random() * (range_max - range_min)) + range_min;
        show(item);
        return new Promise(resolve => {
            document.addEventListener('keydown', key_handler, { once: true });
            let timeout = setTimeout(() => {
                if (press) {
                    quetion_Result += "1_0_0~";
                } else {
                    group_set = 1;
                    quetion_Result += "0_0_1~";
                }
                hide(item);
                resolve([quetion_Result, group_set]);
            }, interval)
            function key_handler(e) {
                if (press) {
                    group_set = 1;
                    quetion_Result += "1_1_1~";   //Color
                } else {
                    quetion_Result += "0_1_0~";
                }
                hide(item);
                clearTimeout(timeout);
                resolve([quetion_Result, group_set]);
            }
        });
    }
    async process() {
        while (1) {
            this._question = this._createQuestion(this._level);
            let number = 0;
            let count = 0;
            await collapse(cross, 1000);
            show(this.nine_grid);
            await collapse(null, 1000);
            for (var item of this._question) {
                console.log(item);
                let element = document.querySelector('rect[name="' + item[0] + '"]');
                this._one += item[0] + "_";
                await this._generateAnswer(element, item[1], 250).then((data) => {
                    this._one += data[0];
                    if (count >= this._level) {
                        number += data[1];
                    }
                    count++;
                    console.log(number);
                });
                await collapse(null, 1250);
            }
            hide(this.nine_grid);
            this._group.push(number);
            this._total += number;
            // console.log(this._group);
            // console.log(this._total);
            // console.log(this._question.length);
            if (number < this.game_set * 0.8 || this.practice) {
                break;
            } else {
                this._level++;
            }

        }
        //finish process
        finish_btn.click();
    }
    get one() {
        let one = this._one.slice(0, -1);//remove last~
        return one;
    }
    get group() {
        let group = "";
        console.log(this._total);
        group += this._level + "_" + (this._total * 100 / (this.game_set * (this._level - 1))).toFixed(2) + "_" + this._total + "_";
        for (let i = 0; i < this._group.length; ++i) {
            group += this._group[i] + "_";
        }
        group = group.slice(0, -1);
        return group.replaceAll("NaN", "NA");
    }
}


class K {
    constructor(game_set) {
        this.game_set = game_set;
        this.word = document.createElement("label");
        //this.ball = add_ball( [ 'ball-80', 'center-screen' ]);
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
            document.addEventListener('keydown', key_handler, { once: true });
            let timeout = setTimeout(() => {    //if time out
                // document.removeEventListener('keydown', key_handler);
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
                // document.removeEventListener('keydown', key_handler);
                hide(item);
                clearTimeout(timeout);
                resolve([quetion_Result, group_set, group_time]);
            }
        });
    }
    async process() {
        for (var number in this.question) {
            // if(number>this.game_set){
            //     break
            // }
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
            console.log(this._one);
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
        let one = this._one.slice(0, -1);//remove last~
        return one;
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
function competitor(object_list, ratio) {
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


//create the  object 
var add_ball = function (cs) {
    let obj = document.createElement("ball");
    cs.forEach(element => {
        obj.classList.add(element);
    });
    return obj;
}

//hide object 
function hide(obj) {
    if (obj != null) {
        if (Array.isArray(obj)) {
            obj.forEach(element => {
                element.style.display = "none";
            });
        } else {
            obj.style.display = "none";
        }
    }

}

//show object
function show(obj) {
    if (obj != null) {
        if (Array.isArray(obj)) {
            obj.forEach(element => {
                element.style.display = "block";
            });
        } else {
            obj.style.display = "block";
        }
    }
    // if (obj != null)
    //     obj.style.display = "inline-block";
}