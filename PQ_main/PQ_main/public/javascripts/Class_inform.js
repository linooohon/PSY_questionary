var cross = document.getElementById("cross"); //initial cross
var finish_btn = document.getElementById("finish_btn") //the btn to say finish
var body = document.body; //apend item


var BALL_COLOR = {
    R: "red",
    G: "green",
    B: "blue",
    Y: "yellow",
};
var Color_Set = {
    "red": "red",
    "green": "rgb(0, 255, 0)",
    "blue": "rgb(0, 0, 255)",
    "yellow": "yellow",
}
var KEY_COLOR = {
    f: "red",
    j: "green",
    s: "blue",
    l: "yellow"
};
var KEY_NUM = {
    j: "1",
    f: "2",
    s: "3",
    l: "4"
}
var COLOR_NUM = {
    "green": "1",
    "red": "2",
    "blue": "3",
    "yellow": "4"
}
var ARROW_NUM = {
    d: "1",
    s: "2",
    a: "3",
    w: "4"
}


class A {
    constructor(game_set) {
        this.game_set = game_set;
        this.ball = add_ball(['ball-80', 'center-screen']);
        //game_set ratio:green 7, red 3
        this.ratio = {
            G: game_set / 10 * 7,
            R: game_set / 10 * 3,
        }
        this._question = [];
        this._groupset = [0, 0, 0, 0]; //ACC_tRT_FA_tFART
        this._one = "";
        this._group = "";
        this._pr = "";
        this._init_item();
        this._createQuestion();
    }
    _init_item() {
        body.appendChild(this.ball);
    }
    _createQuestion() {
        this._question = competitor([Color_Set.green, Color_Set.red], [this.ratio.G, this.ratio.R]); //change the question
    }
    _generateAnswer = (item, range_min, range_max) => {
        let start = Date.now();
        let interval = range_min;
        let quetion_Result = "";
        let color = getKeyByValue(Color_Set, item.style.backgroundColor.toString());
        let group_set = [0, 0, 0, 0]; //ACC_tRT_FA_tFART
        if (range_max != undefined)
            interval = Math.floor(Math.random() * (range_max - range_min)) + range_min;
        quetion_Result += COLOR_NUM[color] + "_"; //Color
        show(item); //show the item
        return new Promise(resolve => {
            document.addEventListener('keydown', key_handler, {
                once: true  // fire only once
            });
            let timeout = setTimeout(() => {
                if (color === BALL_COLOR.R) {
                    group_set[0]++; //GACC
                    quetion_Result += "1_NA~"; //OAcc_RT
                } else {
                    quetion_Result += "0_NA~"; //OAcc_RT
                }
                hide(item);
                resolve([quetion_Result, group_set]);
            }, interval)
            function key_handler(e) {
                let end = Date.now();
                console.log(e.key);
                if (KEY_COLOR[e.key] == color && color === BALL_COLOR.G) {
                    group_set[0]++; //GACC
                    group_set[1] += (end - start); //GRT
                    quetion_Result += "1_" + (end - start).toString() + "~"; //OAcc_RT
                } else {
                    group_set[2]++; //GFA
                    group_set[3] += (end - start); //GFART
                    quetion_Result += "0_" + (end - start).toString() + "~"; //OAcc_RT
                }
                hide(item);
                clearTimeout(timeout);
                resolve([quetion_Result, group_set]);
            }
        });
    }
    async process() {
        for (var item of this._question) {
            await collapse(cross, 50, 50); //start range 200-800
            this.ball.style.backgroundColor = item;
            await this._generateAnswer(this.ball, 500).then((data) => {
                this._one += data[0];
                this._groupset = this._groupset.map((num, idx) => num + data[1][idx]);
            });
            console.log(this._one);
            await collapse(null, 50,50);//100-300
        }
        //analyzedata
        this._analyzeData();
        //finish process
        finish_btn.click();
    }
    _analyzeData() {
        this._one = this._one.slice(0, -1); //remove last~
        let Acc = Math.round((this._groupset[0] * 100 / this.game_set) * 100) / 100;
        let RT = Math.round((this._groupset[1] / this._groupset[0]) * 100) / 100;
        let FA = Math.round((this._groupset[2] * 100 / this.game_set) * 100) / 100;
        let FART = Math.round((this._groupset[3] / this._groupset[2]) * 100) / 100;
        this._group = (Acc + "_" + RT + "_" + FA + "_" + FART).replaceAll("NaN", "NA");
        Acc=Acc.toString().replaceAll("NaN",0);
        RT=RT.toString().replaceAll("NaN",500);
        this._pr = (Acc + "_" + RT + "_" + Acc + "_" + RT).replaceAll("NaN", "NA");
    }
    get one() {
        return this._one;
    }
    get group() {
        return this._group;
    }
    get pr() {
        return this._pr;
    }
}

class B {
    constructor(game_set) {
        this.game_set = game_set;
        this.ball = add_ball(['ball-80', 'center-screen']);
        this.ratio = game_set / 2;  //red and green half ratio
        this._beenum = Math.round(game_set / 4); //make sure it's integer
        this._question = [];
        this._bee = [];
        this._groupset = [0, 0, 0, 0, 0, 0]; //ACC_GoAcc_GoRT_NCRate_NCRT_mSSD
        this._one = "";
        this._group = "";
        this._pr = "";
        this._init_item();
        this._createQuestion();
    }
    _init_item() {
        body.appendChild(this.ball);
    }
    _createQuestion() {
        this._question = competitor([Color_Set.green, Color_Set.red], this.ratio);
        this._bee = competitor([1, 0], [this._beenum, this.game_set - this._beenum]); // 1 have bee 0 no bee
    }
    _generateAnswer = (item, bee, delay_num, range_min, range_max) => {
        var bee_start = document.getElementById("beestart-btn");
        var bee_stop = document.getElementById("beestop-btn");
        let start = Date.now();
        let interval = range_min;
        let group_set = [0, 0, 0, 0, 0, 0]; //ACC_GoAcc_GoRT_NCRate_NCRT_mSSD
        let quetion_Result = "";
        let color = getKeyByValue(Color_Set, item.style.backgroundColor);
        let plus = 0;
        group_set[5] = delay_num; //mSSD 
        if (range_max != undefined)
            interval = Math.floor(Math.random() * (range_max - range_min)) + range_min;
        quetion_Result += COLOR_NUM[color] + "_"; //Color
        if (bee) { //CorrAns
            var bee_time = setTimeout(bee_start.click(), delay_num); //bee start
            quetion_Result += "0_"
        } else {
            quetion_Result += COLOR_NUM[color] + "_";
        }
        show(item);
        return new Promise(resolve => {
            document.addEventListener('keydown', key_handler, {
                once: true
            });
            let timeout = setTimeout(() => {
                if (bee) {
                    group_set[0] = 1; //Acc
                    quetion_Result += "0_1_NA_" + delay_num + "_SSAcc~"; //Press_Acc_RT_SSD_SSAcc
                    plus = 33;
                    bee_stop.click();
                    clearTimeout(bee_time);
                } else {
                    quetion_Result += "0_0_NA_NA_SSAcc~"; //Press_Acc_RT_SSD_SSAcc
                }
                hide(item);
                resolve([quetion_Result, group_set, delay_num + plus]);
            }, interval)

            function key_handler(e) {
                let end = Date.now();
                if (KEY_COLOR[e.key] != undefined) {
                    if (!bee) {
                        if (KEY_COLOR[e.key] == color) {
                            group_set[0] = 1; //Acc
                            group_set[1] = 1; //Go_Acc
                            group_set[2] = end - start; //Go_Rt
                            quetion_Result += KEY_NUM[e.key] + "_1_" + (end - start).toString() + "_NA_SSAcc~"; //Press_Acc_RT_SSD_SSAcc
                        } else {
                            quetion_Result += KEY_NUM[e.key] + "_0_" + (end - start).toString() + "_NA_SSAcc~"; //Press_Acc_RT_SSD_SSAcc
                        }
                    } else {
                        plus = -33;
                        group_set[3] = 1; //NCRate
                        group_set[4] = end - start; //NC_RT
                        quetion_Result += KEY_NUM[e.key] + "_0_" + (end - start).toString() + "_" + bee.toString() + "_SSAcc~";
                        bee_stop.click();
                        clearTimeout(bee_time);
                    }
                } else {
                    quetion_Result += "NA_" + "_0_" + (end - start).toString() + "_" + bee.toString() + "_SSAcc~"; //press wrong
                }
                hide(item);
                clearTimeout(timeout);
                resolve([quetion_Result, group_set, delay_num + plus]);
            }
        });
    }
    async process() {
        var delay_num = 200;
        for (var number in this._question) {
            await collapse(cross, 50);//500
            this.ball.style.backgroundColor = this._question[number];
            var has_bee = this._bee[number];
            await this._generateAnswer(this.ball, has_bee, delay_num, 500).then(
                (data) => {
                    this._one += data[0];
                    this._groupset = this._groupset.map((num, idx) => num + data[1][idx]);
                    if (data[2] >= 0 || data[2] <= 450)
                        delay_num = data[2];
                });
            await collapse(null, 10, 50);//100-300
        }
        this._analyzeData();
        finish_btn.click();
    }
    _analyzeData() {
        //this.one
        let Cp = Math.round(((this._beenum - this._groupset[3]) / this._beenum * 100) * 100) / 100;
        this._one = this._one.replaceAll("SSAcc", Cp).slice(0, -1); //remove last~

        //this.group
        let Acc = Math.round((this._groupset[0] / this.game_set * 100) * 100) / 100;
        let Go_Acc = Math.round((this._groupset[1] / (this.game_set - this._beenum) * 100) * 100) / 100;
        let Go_Rt = Math.round((this._groupset[2] / this._groupset[1]) * 100) / 100;
        let NcRate = Math.round((this._groupset[3] / this._beenum * 100) * 100) / 100;
        let Nc_Rt = Math.round((this._groupset[4] / this._groupset[3]) * 100) / 100;
        let mSSD = Math.round((this._groupset[5] / this._beenum) * 100) / 100;
        let SSRT = Go_Rt - mSSD; 
        this._group = (Acc + "_" + Go_Acc + "_" + Go_Rt + "_" + NcRate + "_" + Nc_Rt + "_" + mSSD + "_" + SSRT).replaceAll("NaN", "NA");
        Go_Rt=Go_Rt.toString().replaceAll("NaN",500);
        SSRT=SSRT.toString().replaceAll("NaN",500);
        // this._pr
        this._pr = (Acc + "_" + Go_Rt + "_" + SSRT).replaceAll("NaN", "NA");
    }
    get one() {
        return this._one;
    }
    get group() {
        return this._group;
    }
    get pr() {
        return this._pr;
    }
}

//20 + (±1)(41-n)(0.4 + 0.1k)   20%[起始] +(-)[對就減少,錯增加] 1 * (41 - n[第幾題]) * (0.4 + 0.1 * k[目前連對或連錯幾題])
class C {
    constructor(game_set) {
        this.game_set = game_set;
        this.spawn_div = document.getElementById("spawn");
        this.remind_btn = document.querySelector('button[name="remind_btn"]');
        this.run = document.querySelector('button[name="ballrun"]');
        this.renew = document.querySelector('button[name="ballrenew"]');
        this._question = [];
        this.ballnum = 500;
        this._whole = this.ballnum * 0.2
        this._groupset = [0, 0, 0, 0, 0, 0];
        this._one = "";
        this._group = "";
        this._pr = "";
        this._init_item();
        this._createQuestion();
        this.DIRECTION = {
            1: 'right',
            2: 'down',
            3: 'left',
            4: 'up',
        }
    }
    _init_item() {}
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
            document.addEventListener('keydown', key_handler, {
                once: true
            });
            let timeout = setTimeout(() => {
                quetion_Result += "NA_0_" + direction + "_NA~";
                hide(item);
                resolve([quetion_Result, group_set]);
            }, interval)

            function key_handler(e) {
                let end = Date.now();
                let keydown = ARROW_NUM[e.key];
                if (keydown == undefined) { //avoid press wrong
                    keydown = "NA";
                } else if (keydown == direction) {
                    group_set = 1;
                }
                quetion_Result += (end - start) + "_" + group_set + "_" + direction + "_" + keydown + "~";
                hide(item);
                clearTimeout(timeout);
                resolve([quetion_Result, group_set]);
            }
        });
    }
    async process() {
        for (let session = 0; session < this.game_set[0]; ++session) {
            let part_right = 0;
            let ratio = Math.round(this.ballnum * 0.2*100)/100;
            let flip = 0;
            let conti = 0;
            for (let i = 0; i < this.game_set[1]; ++i) {
                let direction = Math.floor(Math.random() * 4) + 1; //1 to 4
                for (let d = 0; d < this.ballnum; ++d) {
                    if (d < ratio) {
                        this.spawn_div.children[d].setAttribute('direction', this.DIRECTION[direction]);
                    } else {
                        this.spawn_div.children[d].setAttribute('direction', 'random');
                    }
                }
                this.renew.click();
                this._one += Math.round(ratio*100/this.ballnum) + "_";//Coherence Rate
                await collapse(cross, 1000); //start 1000
                this.run.click();
                await collapse(this.spawn_div, 500); //500
                await this._generateAnswer(null, direction, 3000).then((data) => { //3000
                    this._one += data[0];
                    part_right += data[1];
                    flip == data[1] ? conti++ : conti = 0;
                    flip = data[1];
                });
                flip == 0 ? ratio = this._createQuestion(1, i, conti) : ratio = this._createQuestion(-1, i, conti);
                ratio = Math.round(ratio*100)/100;  //ratio set to 2 decimal
            }
            this._one = this._one.slice(0, -1) + "-"; //change session
           
            this._groupset[session] = part_right;
            this._groupset[session + 3] = ratio;
            if (session + 1 < this.game_set[0]) {
                await new Promise(resolve => {
                    this.remind_btn.click();
                    this.remind_btn.nextElementSibling.textContent = "共三回合 接下來是第" + (session + 2) + "回合";

                    function keyhandle(e) {
                        if (e.key == "Enter") { //press enter
                            window.removeEventListener('keydown', keyhandle);
                            resolve();
                        }
                    }
                    window.addEventListener('keydown', keyhandle); //once true ,the listener will be remove after invoke      
                });
                this.remind_btn.click();
            }
            console.log("next");
        }
        //analyze data
        this._analyzeData();
        //finish process
        finish_btn.click();
    }
    _analyzeData() {
        this._one = this._one.slice(0, -1); //remove last~
        let AccR1 = Math.round((this._groupset[0] * 100 / this.game_set[1]) * 100) / 100;
        let AccR2 = Math.round((this._groupset[1] * 100 / this.game_set[1]) * 100) / 100;
        let AccR3 = Math.round((this._groupset[2] * 100 / this.game_set[1]) * 100) / 100;
        let CRR1 = Math.round((this._groupset[3] * 100 / this.ballnum) * 100) / 100;
        let CRR2 = Math.round((this._groupset[4] * 100 / this.ballnum) * 100) / 100;
        let CRR3 = Math.round((this._groupset[5] * 100 / this.ballnum) * 100) / 100;
        console.log(CRR1, CRR2, CRR3);
        let Aver = Math.round(((CRR1 + CRR2 + CRR3) / 3) * 100) / 100;
        let AccAver = Math.round(((AccR1 + AccR2 + AccR3) / 3) * 100) / 100;
        this._group = (AccR1 + "_" + AccR2 + "_" + AccR3 + "_" + CRR1 + "_" + CRR2 + "_" + CRR3 + "_" + Aver).replaceAll("NaN", "NA");
        this._pr = AccAver + "_" + Aver;
    }
    get one() {
        return this._one;
    }
    get group() {
        return this._group;
    }
    get pr() {
        return this._pr;
    }
}

class D {
    constructor(game_set) {
        this.game_set = game_set;
        this.ratio = {
            G: game_set / 10 * 7,
            R: game_set / 10 * 3,
        }
        this.remind_btn = document.querySelector('button[name="remind_btn"]');
        this.garbor = document.getElementById("garbordiv");
        this._question = [];
        this.garborsize = [20, 60, 200];
        this.direction = ["MOVE-Right", "MOVE-Left"];
        this.averagebox = [0, 0, 0];
        this.correct = 0;
        this.tmp = [];
        this.timer = 500;
        this._acc=0;
        this._groupset = "";
        this._one = "";
        this._group = "";
        this._pr = "";
        this._init_item();
        this._createQuestion();
    }
    _init_item() {}
    set garbosize(list=[20, 60, 200]){
        this.garborsize =list;
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
        let interval = range_min;
        let quetion_Result = "";
        if (range_max != undefined)
            interval = Math.floor(Math.random() * (range_max - range_min)) + range_min;
        return new Promise(resolve => {
            document.addEventListener('keydown', key_handler, {
                once: true
            });
            let timeout = setTimeout(() => {
                quetion_Result += "NA_0~";
                resolve([quetion_Result, 0]);
            }, interval)

            function key_handler(e) {
                if (KEY_NUM[e.key] != undefined) {
                    if (KEY_NUM[e.key] == direction.toString()) {
                        quetion_Result += KEY_NUM[e.key] + "_1~";
                        clearTimeout(timeout);
                        resolve([quetion_Result, 1]);
                    } else {
                        quetion_Result += KEY_NUM[e.key] + "_0~"
                        clearTimeout(timeout);
                        resolve([quetion_Result, 0]);
                    }
                } else {
                    quetion_Result += "NA_0~"
                }

            }
        });
    }
    async process() {
        this.timer = 80;
        this.last_timer = 80;
        for (let session = 0; session < this._question.length; ++session) {            
            let part = [0, 0, 0, 0, 0, 0, 0, 0, 0]; //lar t1 t2 t3
            for (var item of this._question[session]) { //size direction
                this.tmp = item;
                let tmp_timer = this.timer;
                console.log(this.timer,this.last_timer,tmp_timer);  
                await collapse(cross, 300); //start 300
                document.documentElement.style.setProperty('--size', this.garborsize[item[0]] + 'px');
                document.documentElement.style.setProperty('--move-direction', this.direction[item[1]]);
                this.garbor.setAttribute("style", "top:" + (window.innerHeight - this.garborsize[item[0]]) / 2 + "px;" + "left:" + (window.innerWidth - this.garborsize[item[0]]) / 2 + "px");
                await collapse(this.garbor,this.timer);//this.timer
                this._one += (item[0] + 1) + "_" + Math.round(this.timer * 100) / 100 + "_" + (item[1] + 1) + "_"; //size pre direction
                await this._generateAnswer(item[1] + 1, 5000).then((data) => {//5000
                    this._one += data[0];
                    this.correct = data[1];
                    // if (this.correct==0){
                    //     console.log(this.timer + (Math.abs(this.last_timer - this.timer) * 0.3 + 1)+" not correct");
                    //     this.timer = this.timer + (Math.abs(this.last_timer - this.timer) * 0.3 + 1);
                    // }else{
                    //     console.log(this.timer - (Math.abs(this.last_timer - this.timer) * 0.3 + 1)+" correct");
                    //     this.timer = this.timer - (Math.abs(this.last_timer - this.timer) * 0.3 + 1);
                    // }
                    this.correct == 0 ? this.timer = this.timer + (Math.abs(this.last_timer - this.timer) * 0.3 + 1) : this.timer = this.timer - (Math.abs(this.last_timer - this.timer) * 0.3 + 1);
                   
                    if (this.timer < 1) {
                        this.timer = 1;
                    }
                    this.last_timer = tmp_timer;
                    part[this.tmp[0]]++;
                    part[this.tmp[0] + 6] = this.timer;
                    if (this.correct != 0) {
                        part[this.tmp[0] + 3]++;
                    }
                });
                console.log(part);
            }
            this._one = this._one.slice(0, -1) + "-";
            this.averagebox[0] += part[6];
            this.averagebox[1] += part[7];
            this.averagebox[2] += part[8];
            console.log(this.averagebox);
            this._acc += ((part[3] / part[0] * 100) + (part[4] / part[1] * 100) + (part[5] / part[2] * 100));
            this._groupset +=  Math.round(part[6] * 100) / 100 + "_" +  Math.round(part[7] * 100) / 100 + "_" +  Math.round(part[8] * 100) / 100 + "_"+
            Math.round((part[3] / part[0] * 100) * 100) / 100 + "_" +Math.round((part[4] / part[1] * 100) * 100) / 100 + "_" + Math.round((part[5] / part[2] * 100) * 100) / 100 + "_";
            console.log(this._groupset);
            if (session + 1 < this.game_set[0]) {
                await new Promise(resolve => {
                    this.remind_btn.click();
                    this.remind_btn.nextElementSibling.textContent = "共三回合 接下來是第" + (session + 2) + "回合";

                    function keyhandle(e) {
                        if (e.key == "Enter") {
                            window.removeEventListener('keydown', keyhandle);
                            resolve();
                        }

                    }
                    window.addEventListener('keydown', keyhandle); //once true ,the listener will be remove after invoke      
                });
                this.remind_btn.click();
            }
        }
        //analyzedata
        this._analyzeData();
        //finish process
        finish_btn.click();
    }
    _analyzeData() {
        let mt1 = Math.round((this.averagebox[0] / 3) * 100) / 100;
        let mt5 = Math.round((this.averagebox[1] / 3) * 100) / 100;
        let mt10 = Math.round((this.averagebox[2] / 3) * 100) / 100;
        let SI =Math.round((mt10-mt1)*100)/100;
        this._groupset += mt1 + "_" + mt5 + "_" + mt10 +"_"+SI;
        this._one = this._one.slice(0, -1).replaceAll("NaN", "NA"); //remove last~
        this._group = this._groupset.replaceAll("NaN", "NA");
        this._pr = Math.round((this._acc / 9) * 100) / 100 + "_" + Math.round((mt10 / mt1) * 100) / 100;
    }
    get one() {
        return this._one;
    }
    get group() {
        return this._group;
    }
    get pr() {
        return this._pr;
    }
}
class E {
    constructor(game_set) {
        this.game_set = game_set;
        this.SIDE = {
            0: 'upper',
            1: 'downer'
        }
        this.arrowplace = document.getElementById("arrow_place").children; //0-2 right 3-5 left c i n
        this.clueplace = document.getElementById("clue_place").children; //N0 C1 D2 S3
        this._question = [];
        this._groupset = [0, 0, 0, 0, 0, 0, 0, 0]; //rt-space*4-arrow*3
        this._group_num = [0, 0, 0, 0, 0, 0, 0, 0]; //accspace*4-arrow*3
        this._one = "";
        this._group = "";
        this._pr = "";
        this._createQuestion();
    }
    _init_item() {}
    _createQuestion() {
        let spartial = 0;
        while (1) {
            for (let cluek = 0; cluek < 3; ++cluek) { //no spartial
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
            for (let arrowk = 0; arrowk < 3; ++arrowk) { //spartial side  
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
            document.addEventListener('keydown', key_handler, {
                once: true
            });
            let timeout = setTimeout(() => {
                quetion_Result += "0_0_1700~"; //press-acc-rt
                group_set = [0, 1700];
                hide(item);
                resolve([quetion_Result, group_set]);
            }, interval)

            function key_handler(e) {
                let end = Date.now();
                if (KEY_NUM[e.key] != undefined) {
                    if (KEY_NUM[e.key] == (direction + 1).toString()) {
                        quetion_Result += KEY_NUM[e.key] + "_1_" + (end - start).toString() + "~"; //press-acc-rt
                        group_set = [1, end - start];
                    } else {
                        quetion_Result += KEY_NUM[e.key] + "_0_" + (end - start).toString() + "~"; //press-acc-rt
                        group_set = [0, end - start];
                    }
                } else {
                    quetion_Result += "NA_0_" + (end - start).toString() + "~"; //press-acc-rt
                }

                hide(item);
                clearTimeout(timeout);
                resolve([quetion_Result, group_set]);
            }
        });
    }
    async process() {
        for (var item of this._question) { //[cluek,arrowk,side,tag]
            let getgroup = [];
            let cross_time = Math.floor(Math.random() * 1200) + 400;
            await collapse(cross, 100); //start -cross_time
            if (item[0] == 3) {
                this.clueplace[item[0]].setAttribute("side", this.SIDE[item[2]]);
            }
            console.log(this.clueplace[item[0]]);
            await collapse(this.clueplace[item[0]], 500);//100
            this.clueplace[item[0]].removeAttribute("side");
            await collapse(cross, 50);//400

            this._one += (item[0] + 1) + "_" + (item[1] + 1) + "_" + (item[2] + 1) + "_" + (item[3] + 1) + "_"; //cue-con-pos-ori-
            //nci + right or left
            this.arrowplace[item[1] + item[3] * 3].setAttribute("side", this.SIDE[item[2]]);
            await this._generateAnswer(this.arrowplace[item[1] + item[3] * 3], item[3], 1700).then((data) => {
                this._one += data[0];
                getgroup = data[1];
            });
            this.arrowplace[item[1] + item[3] * 3].removeAttribute("side");
            if (getgroup[0]) {
                this._group_num[0] += getgroup[0]; //acc rt
                this._groupset[0] += getgroup[1];
                this._group_num[1 + item[0]] += getgroup[0]; //space
                this._groupset[1 + item[0]] += getgroup[1];
                this._group_num[5 + item[1]] += getgroup[0]; //arror
                this._groupset[5 + item[1]] += getgroup[1];
            }
            // console.log(item);
            // console.log(this._one);
            // console.log(this._groupset);
            // console.log(this._group_num);
            await collapse(null, 3500 - cross_time - getgroup[1]);
        }
        //anaylyze data
        this._analyzeData();
        //finish process
        finish_btn.click();
        console.log(this.one);
        console.log(this.group);
    }
    _analyzeData() {
        this._one = this._one.slice(0, -1).replaceAll("NaN", "NA"); //remove last~
        let Acc = Math.round((this._group_num[0] * 100 / this.game_set) * 100) / 100;
        let RT = Math.round((this._groupset[0] / this._group_num[0]) * 100) / 100;
        let No = Math.round((this._groupset[1] / this._group_num[1]) * 100) / 100;
        let Ce = Math.round((this._groupset[2] / this._group_num[2]) * 100) / 100;
        let Du = Math.round((this._groupset[3] / this._group_num[3]) * 100) / 100;
        let Sp = Math.round((this._groupset[4] / this._group_num[4]) * 100) / 100;
        let Co = Math.round((this._groupset[5] / this._group_num[5]) * 100) / 100;
        let In = Math.round((this._groupset[6] / this._group_num[6]) * 100) / 100;
        let Ne = Math.round((this._groupset[7] / this._group_num[7]) * 100) / 100;
        let Al = Math.round((No - Du)*100)/100;
        let Or = Math.round((Ce - Sp)*100)/100;
        let Conflict = Math.round((In - Co)*100)/100;
        this._group = (Acc + "_" + RT + "_" + No + "_" + Ce + "_" + Du + "_" + Sp + "_" + Co + "_" + In + "_" + Ne + "_" + Al + "_" + Or + "_" + Conflict).replaceAll("NaN", "NA");
        RT= RT.toString().replaceAll("NaN", 1700)
        this._pr = (Acc + "_" + RT + "_" + Al + "_" + Or + "_" + Conflict).replaceAll("NaN", "NA");
    }
    get one() {
        return this._one;
    }
    get group() {
        return this._group;
    }
    get pr() {
        return this._pr;
    }
}

class F {
    constructor(game_set) {
        this.game_set = game_set;
        this.SoA = [50, 1050];
        this._question = []; //[eys,rectplace,second]
        this.pic = document.getElementById("image");
        this._groupset = [0, 0, 0, 0, 0, 0];
        this._group_num = [0, 0, 0, 0, 0, 0];
        this._one = "";
        this._group = "";
        this._pr = "";
        this.IMG_NAME = {
            0: "/image/eye.jpg",
            1: "/image/eye_L.jpg",
            2: "/image/eye_R.jpg",
        }
        this.rect = document.getElementById("rect_div").children; //0:left ,1:right
        this._createQuestion();
    }
    _init_item() {}
    _createQuestion() { //gameset length
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
                        if (this._question.length >= this.game_set) { //make it correct size
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
        let group_set = [0, 0]; //Acc_Rt
        if (range_max != undefined)
            interval = Math.floor(Math.random() * (range_max - range_min)) + range_min;
        show(item);
        return new Promise(resolve => {
            document.addEventListener('keydown', key_handler, {
                once: true
            });
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
                if (KEY_NUM[e.key] != undefined) {
                    targetposition == Direction_Num[e.key] ? group_set = [1, end - start] : group_set = [0, end - start];
                    if (group_set[0] == 0) {
                        quetion_Result += KEY_NUM[e.key] + "_2_" + group_set[1] + "~" //Press_Acc_RT
                        group_set = [0, 0];
                    } else {
                        quetion_Result += KEY_NUM[e.key] + "_1_" + group_set[1] + "~" //Press_Acc_RT
                    }
                } else {
                    group_set = [0, end - start];
                    quetion_Result += "NA_2_" + group_set[1] + "~" //Press_Acc_RT
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
            await collapse(cross, 10); //start 1000
            this.pic.src = this.IMG_NAME[0];
            await collapse(this.pic, 50); //eye 1000
            this.pic.src = this.IMG_NAME[item[0]];
            await collapse(this.pic, 50); //look 150
            this.pic.src = this.IMG_NAME[0]; //eye
            await collapse(this.pic, 50); //item[2]
            this._one += item[3] + "_" + (item[2] + 150) + "_" + (item[1] + 1).toString() + "_"; //Cue-Soa-pos
            await this._generateAnswer([this.pic, this.rect[item[1]]], item[1], 800).then((data) => {
                this._one += data[0];
                get_group = data[1];
            });
            this._group_num[0] += get_group[0];
            this._groupset[0] += get_group[1];
            this._group_num[item[3]] += get_group[0];
            this._groupset[item[3]] += get_group[1];
            if (item[2] == 50) {
                this._group_num[4] += get_group[0];
                this._groupset[4] += get_group[1];
            } else {
                this._group_num[5] += get_group[0];
                this._groupset[5] += get_group[1];
            }
        }
        this._analyzeData();
        //finish process
        finish_btn.click();
    }
    _analyzeData() {
        this._one = this._one.slice(0, -1).replaceAll("NaN", "NA"); //remove last~
        let Acc = Math.round((this._group_num[0] * 100 / this.game_set) * 100) / 100;
        let RT = Math.round((this._groupset[0] / this._group_num[0]) * 100) / 100;
        let Ne = Math.round((this._groupset[1] / this._group_num[1]) * 100) / 100;
        let Co = Math.round((this._groupset[2] / this._group_num[2]) * 100) / 100;
        let Ico = Math.round((this._groupset[3] / this._group_num[3]) * 100) / 100;
        let Soa200 = Math.round((this._groupset[4] / this._group_num[4]) * 100) / 100;
        let Soa1200 = Math.round((this._groupset[5] / this._group_num[5]) * 100) / 100;
        this._group = (Acc + "_" + RT + "_" + Ne + "_" + Co + "_" + Ico + "_" + Soa200 + "_" + Soa1200).replaceAll("NaN", "NA");
        RT =RT.toString().replaceAll("NaN", 800);
        this._pr = (Acc + "_" + RT + "_" + Ne + "_" + Co + "_" + Ico).replaceAll("NaN", "NA");
    }
    get one() {
        return this._one;
    }
    get group() {
        return this._group;
    }
    get pr() {
        return this._pr;
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
    _init_item() {}
    _createQuestion() {}
    _generateAnswer = () => {}

    async process() {
        for (;; this._level++) {
            let session_score = 0;
            for (let length = 0; length < this.game_set; ++length) {
                this.renew.click();
                await collapse(cross, 10); //cross 1000
                show(this.spawn_div);
                await new Promise(resolve => {
                    var div = this.spawn_div;
                    var runbtn = this.run;
                    var click = this._click;

                    function keyhandle(e) {
                        if (e.key == "Enter") {
                            console.log(div);
                            for (let i = 0; i < click; ++i) {
                                div.childNodes[i].classList.remove('blink');
                                //div.childNodes[i].style.backgroundColor = "rgb(0,0,100)";
                                div.childNodes[i].classList.add('enable_click');
                            }
                            runbtn.click();
                            window.removeEventListener('keydown', keyhandle);
                            resolve();
                        }
                    }
                    window.addEventListener('keydown', keyhandle);
                });
                await collapse(null, 50); //move 5000
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
                    this.spawn_div.childNodes[i].style.backgroundColor = "yellow";
                    this.spawn_div.childNodes[i].classList.add('enable_click');
                }
            }
            this._one = this._one.slice(0, -1) + "-";
            this._score += session_score;
            if (session_score < 10 || !this.haslevel) {
                break;
            } else {
                this.addball.click();
            }
        }
        this._analyzeData();
        //finish process
        finish_btn.click();
    }
    _analyzeData() {
        // console.log((this._level - 5) * 4 * 3);
        this._one = this._one.slice(0, -1).replaceAll("NaN", "NA"); //remove last~
        let Acc = Math.round((this._score * 100 / ((this._level - 5) * 4 * 3)) * 100) / 100;
        this._group = (this._level + "_" + this._score + "_" + Acc).replaceAll("NaN", "NA");
        this._pr = (Acc + "_" + this._score).replaceAll("NaN", "NA");
    }
    get one() {
        return this._one;
    }
    get group() {
        return this._group;
    }
    get pr() {
        return this._pr;
    }
}

/* class H
3 PART number_set: game_set[part 1,part 2,part 3];
*/
class H {
    constructor(game_set) {
        this.game_set = game_set;
        this.remind_btn = document.querySelector('button[name="remind_btn"]');
        this.ball = add_ball(['ball-80', 'center-screen']);
        this.ratio = [game_set[0], game_set[1] / 2, game_set[2] / 4];
        this._question = [];
        this._groupset = [0, 0, 0, 0, 0, 0];
        this._one = "";
        this._group = "";
        this._pr = "";
        this._init_item();
        this._createQuestion();
    }
    _init_item() {
        body.appendChild(this.ball);
    }
    _createQuestion() {
        this._question = [
            competitor([Color_Set.green], this.ratio[0]),
            competitor([Color_Set.green, Color_Set.red], this.ratio[1]),
            competitor([Color_Set.green, Color_Set.red, Color_Set.blue, Color_Set.yellow], this.ratio[2]),
        ]
    }
    _generateAnswer = (item, range_min, range_max) => {
        let start = Date.now();
        let interval = range_min;
        if (range_max != undefined)
            interval = Math.floor(Math.random() * (range_max - range_min)) + range_min;
        let quetion_Result = "";
        let press_and_time = [0, 0]; //  number && times
        let color = getKeyByValue(Color_Set, item.style.backgroundColor);
        quetion_Result += COLOR_NUM[color] + "_" + COLOR_NUM[color] + "_"; //Color -correAns
        show(item);
        return new Promise(resolve => {
            document.addEventListener('keydown', key_handler, {
                once: true
            });
            let timeout = setTimeout(() => {
                quetion_Result += "NA_0_NA~";
                hide(item);
                resolve([quetion_Result, press_and_time]);
            }, interval)

            function key_handler(e) {
                let end = Date.now();
                if (KEY_NUM[e.key] != undefined) {
                    quetion_Result += KEY_NUM[e.key] + "_"; //Press_
                    if (KEY_NUM.hasOwnProperty(e.key) && KEY_COLOR[e.key] == color) {
                        press_and_time[0] = 1;
                        press_and_time[1] = (end - start);
                        quetion_Result +="1_" + (end - start).toString() + "~" //Acc_RT
                    } else {
                        quetion_Result += "0_" + (end - start).toString() + "~"; //Acc_RT
                    }
                } else {
                    quetion_Result += "NA_0_" + (end - start).toString() + "~"; //Acc_RT
                }
                hide(item);
                clearTimeout(timeout);
                resolve([quetion_Result, press_and_time]);
            }
        });
    }
    async process() {
        for (let session = 0; session < this._question.length; ++session) {
            let numbertimeset = [0, 0];
            for (var item of this._question[session]) {
                await collapse(cross, 10, 10); //start 200 800
                this.ball.style.backgroundColor = item;
                await this._generateAnswer(this.ball, 500).then((data) => {//500
                    this._one += data[0];
                    numbertimeset[0] += data[1][0];
                    numbertimeset[1] += data[1][1];
                });
                await collapse(null, 10, 10); //100,300
            }
            this._one = this._one.slice(0, -1) + "-"; //change part
            this._groupset[session] = numbertimeset[0] * 100 / this.game_set[session]; //Acc
            this._groupset[session + 3] = numbertimeset[1] / numbertimeset[0]; //Rt
            if (session + 1 < this._question.length) {
                // console.log(this.remind_btn);
                await new Promise(resolve => {
                    this.remind_btn.click();
                    this.remind_btn.nextElementSibling.textContent = "共三回合 接下來是第" + (session + 2) + "回合";

                    function keyhandle(e) {
                        if (e.key == "Enter") { //press enter
                            window.removeEventListener('keydown', keyhandle);
                            resolve();
                        }
                    }
                    window.addEventListener('keydown', keyhandle); //once true ,the listener will be remove after invoke      
                });
                this.remind_btn.click();
            }
        }
        this._analyzeData();
        alert("若已做完此問卷的實際測驗，請去做K問卷");
        //finish process
        finish_btn.click();
    }
    _analyzeData() {
        this._one = this._one.slice(0, -1).replaceAll("NaN", "NA"); //remove last~
        let Acc1 = Math.round(this._groupset[0] * 100) / 100;
        let Acc2 = Math.round(this._groupset[1] * 100) / 100;
        let Acc3 = Math.round(this._groupset[2] * 100) / 100;
        let RT1 = Math.round(this._groupset[3] * 100) / 100;
        let RT2 = Math.round(this._groupset[4] * 100) / 100;
        let RT3 = Math.round(this._groupset[5] * 100) / 100;
        this._group = (Acc1 + "_" + Acc2 + "_" + Acc3 + "_" + RT1 + "_" + RT2 + "_" + RT3).replaceAll('NaN', 'NA');
    }
    get one() {
        return this._one;
    }
    get group() {
        return this._group;
    }
    get pr() {
        return this._pr;
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
        this._groupset = [0, 0]; //Score_Total
        this._one = "";
        this._group = "";
        this._pr = "";
        this._init_item();
        this._createQuestion();
    }
    _init_item() {
        this.number.setAttribute("style", "font-size: 45px; font-weight: bold;");
        this.number.textContent = "";
        this.number.classList.add('center-screen');
        body.appendChild(this.number);
    }
    _createQuestion() {
        for (var question = 0; question < this.ratio.length; ++question) {
            for (var len = 0; len < this.each_game; ++len) {
                var tmp = [];
                for (var number_len = 0; number_len < this.ratio[question]; ++number_len) {
                    tmp.push(Math.floor(Math.random() * 10));
                    this._groupset[1]++;
                }
                this._question.push(tmp);
            }
        }
        shuffle(this._question);
        console.log(this._question);
    }
    _generateAnswer(numberlist, inputline, interval) {
        console.log(numberlist);
        var quetion_Result = "";
        let length = numberlist.length;
        let start = Date.now();
        quetion_Result += length.toString() + "_"; //NofDig
        for (let i = 0; i < length; ++i) { //show item
            quetion_Result += numberlist[i].toString(); //CorrDig
            show(inputline[i], "inline-block");
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
                for (let i = 0; i < length; ++i) { // hide object
                    hide(inputline[i]);
                    inputline[i].textContent = "_";
                    if (keylist.length >= i) {
                        let right = 0;
                        if (keylist[i] == numberlist[i]) //set not finish system
                            right = 1;
                        quetion_Result += right.toString();
                        sum += right;
                    }
                }
                quetion_Result += "_" + sum + "_" + (end - start).toString() + "~";
                console.log(sum);
                resolve([quetion_Result, sum]); // return resolve
            }
            let timeout = setTimeout(() => {
                stopRun();
            }, interval)

            function key_handler(e) {
                if (typenum >= length && e.key == "Enter") {
                    clearTimeout(timeout);
                    stopRun();
                } else if (typenum < length && (e.which >= 96 && e.which <= 105) || (e.which >= 48 && e.which <= 57)) {
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
            await collapse(cross, 10); //start 1000
            for (var item of this._question[part]) {
                this.number.textContent = item;
                await collapse(this.number, 10); //1000
                await collapse(null, 10); //200
            }
            await this._generateAnswer(this._question[part].reverse(), this.inputline, 15000).then((data) => {
                this._one += data[0];
                this._groupset[0] += data[1];
            });
        }
        this._analyzeData();
        //finish process
        finish_btn.click();
    }
    _analyzeData() {
        this._one = this._one.slice(0, -1).replaceAll("NaN", "NA");
        let Score = this._groupset[0];
        console.log(this._groupset);
        let Acc = Math.round(this._groupset[0]* 10000 / this._groupset[1])/100 ;
        this._group = (Score + "_" + Acc).replaceAll("NaN", "NA");
        this._pr = (Acc + "_" + Score).replaceAll("NaN", "NA");
    }
    get one() {
        return this._one;
    }
    get group() {
        return this._group;
    }
    get pr() {
        return this._pr;
    }
}

//N 
class J {
    constructor(game_set, practice = false) {
        this.game_set = game_set;
        this._question = [];
        this._groupset = [];
        this._one = "";
        this._group = "";
        this._pr = "";
        this._total = 0;
        this._level = 2;
        this.remind_btn = document.querySelector('button[name="remind_btn"]');
        this.nine_grid = document.getElementById("nine-grid");
        this._init_item();
        this._createQuestion(2);
        this.practice = practice;
    }
    _init_item() {
        console.log(this.nine_grid);
    }
    _createQuestion(number) {
        let tmp = []; //number- give press sign -need press
        for (let i = 0; i < this.game_set; ++i) {
            if (i < this.game_set / 3) {
                tmp.push([Math.floor(Math.random() * 9) + 1, false, true]);
                console.log("true");
            } else {
                tmp.push([Math.floor(Math.random() * 9) + 1, false, false])
            }
        }
        shuffle(tmp);
        //last numbers
        for (let i = 0; i < number; ++i) {
            tmp.push([Math.floor(Math.random() * 9) + 1, false, false]);
        }
        //create question
        for (let i = 0; i < tmp.length-number; ++i) {
            if (tmp[i][2] == true) {
                tmp[i + number][1] =true;
                tmp[i + number][0] =tmp[i][0];
            }else {
                while(tmp[i + number][0]==tmp[i][0]){
                    tmp[i + number][0]=Math.floor(Math.random() * 9) + 1;
                }   
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
            document.addEventListener('keydown', key_handler, {
                once: true
            });
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
                    console.log(group_set)
                    quetion_Result += "1_1_1~"; //Color
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
            console.log(this._question);
            let count = 0;
            let number=0;
            await collapse(cross, 10);//1000
            show(this.nine_grid);
            await collapse(null, 10);//1000
            for (var item of this._question) {
                let element = document.querySelector('rect[name="' + item[0] + '"]');
                this._one += item[0] + "_";
                if(item[1]==true){
                    console.log("true");
                }
                await this._generateAnswer(element, item[1], 500).then((data) => {//250
                    if(count<this._level){
                        this._one +="NA_NA_NA~"
                    }else{
                        this._one += data[0];
                        number += data[1];
                        console.log(number,count,data[1]);
                    }
                   
                    // if (count >= this._level) {
                       
                    // }
                    count++;
                });
                await collapse(null, 1250);//1250
            }
            hide(this.nine_grid);
            this._groupset.push(number);
            this._total += number;
            await new Promise(resolve => {
                this.remind_btn.click();
                this.remind_btn.nextElementSibling.textContent = "正確題數[" + number+ "/30]";
                function keyhandle(e) {
                    if (e.key == "Enter") {
                        window.removeEventListener('keydown', keyhandle);
                        resolve();
                    }

                }
                window.addEventListener('keydown', keyhandle); 
            });
            this.remind_btn.click();
            if (number < this.game_set * 0.8 || this.practice) {
                break;
            } else {
                this._level++;
            }
            this._one = this._one.slice(0, -1)+"-"; //remove last~
        }
        this._analyzeData();
        //finish process
        console.log("finish");
        finish_btn.click();
    }
    _analyzeData() {
        this._one = this._one.slice(0, -1); //remove last~
        // let Acc = Math.round((this._total * 100 / (this.game_set * (this._level - 1))) * 100) / 100;
        let Acc = Math.round((this._total * 100 / (this.game_set)) * 100) / 100;
        let Score = this._total;
        this._group += this._level + "_" + Acc + "_" + this._total + "_";
        for (let i = 0; i < this._groupset.length; ++i) {
            this._group += this._groupset[i] + "_";
        }
        if (this._groupset.length < 2) {
            this._group += "0_";
        }
        this._group = this._group.slice(0, -1).replaceAll("NaN", "NA");
        this._pr = (Acc + "_" + Score).replaceAll("NaN", "NA");
    }
    get one() {
        return this._one;
    }
    get group() {
        return this._group;
    }
    get pr() {
        return this._pr;
    }
}


class K {
    constructor(game_set) {
        this.game_set = game_set;
        this.word = document.getElementById("text_label");
        //this.ball = add_ball( [ 'ball-80', 'center-screen' ]);
        this.ratio = game_set / 4;
        this.question = [];
        this._group_time = [0, 0, 0];
        this._groupset = [0, 0, 0, 0, 0]; //Acc_RT_Positive_Negative_Middle
        this._one = "";
        this._group = "";
        this._pr = "";
        this._worddict = [
            ["快活", "著迷", "幸福", "暢快", "期待", "開心", "愉快", "喜歡", "高興", "雀躍"], //positive
            ["害怕", "痛心", "驚慌", "恐懼", "痛苦", "氣憤", "恐怖", "焦躁", "生氣", "著急"], //negative
            ["作業", "握拳", "結束", "雨天", "空白", "成績", "發呆", "花錢", "打牌", "早起"]
        ]; //middle
        this._init_item();
        this._createQuestion();
    }
    _init_item() {
        // this.word.setAttribute("style", "font-size: 60px; font-weight: bold; display: none;");
        this.word.textContent = "快樂"; //test code
        this.word.setAttribute("part", ""); //set type of color
        // this.word.style.backgroundColor="rgb(125,125,125)";
        this.word.classList.add('center-screen');
        body.appendChild(this.word);
    }
    _createQuestion() {
        let wordlength = this._worddict[0].length;
        let wordkind = this._worddict.length;
        for (var colortype of Object.values(Color_Set)) {
            for (let kind = 0; kind < wordkind; ++kind) {
                for (let i = 0; i < wordlength; ++i) {
                    this.question.push([this._worddict[kind][i], colortype, kind]); //word color kind
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
        let color = getKeyByValue(Color_Set, item.style.color);
        let condition = parseInt(item.getAttribute("part"));
        let quetion_Result = "";
        let group_time = [0, 0, 0];//postive_num-negatve_num/middle_num
        let group_set = [0, 0, 0, 0, 0]; //Acc_RT_tPositive_tNegative_tMiddle
        quetion_Result += condition + '_'; //Condition
        quetion_Result += item.textContent + "_"; //Pic_text

        quetion_Result += COLOR_NUM[color] + "_"; //Color
        show(item);
        return new Promise(resolve => {
            document.addEventListener('keydown', key_handler, {
                once: true
            });
            let timeout = setTimeout(() => { //if time out
                // document.removeEventListener('keydown', key_handler);
                quetion_Result += "NA_-1~"; //no input
                hide(item);
                resolve([quetion_Result, group_set, group_time]);
            }, interval)

            function key_handler(e) {
                let end = Date.now();
                if (KEY_NUM[e.key] != undefined) {
                    quetion_Result += KEY_NUM[e.key] + "_"; //Press
                    // console.log(KEY_NUM[e.key]);
                    console.log(group_set);
                    if (KEY_COLOR[e.key] == color) {
                        group_time[condition] = 1;
                        group_set[0] = 1; //ACC
                        group_set[1] = end - start; //RT
                        group_set[condition + 2] = (end - start); //PNM
                        // console.log(condition+"------");
                        quetion_Result += "1_" + (end - start).toString() + "~" //ACC_RT
                    } else {
                        quetion_Result += "0_" + (end - start).toString() + "~";
                    }
                } else {
                    quetion_Result += "0_" + (end - start).toString() + "~";
                }
                console.log(group_set);
                hide(item);
                clearTimeout(timeout);
                resolve([quetion_Result, group_set, group_time]);
            }
        });
    }
    async process() {
        for (var number in this.question) {
            await collapse(cross, 10); //start 1000
            this.word.textContent = this.question[number][0];
            this.word.style.color = this.question[number][1];
            this.word.setAttribute("part", this.question[number][2]);
            await this._generateAnswer(this.word, 3000).then((data) => {//3000
                this._one += data[0]; //add the one
                this._groupset = this._groupset.map(function (num, idx) { //add the group
                    return num + data[1][idx];
                });
                this._group_time = this._group_time.map(function (num, idx) { //add the group_time
                    return num + data[2][idx];
                });
            });
            await collapse(null, 10,10);//100-300
        }
        // console.log(this.group);
        this._analyzeData();
        //finish process
        finish_btn.click();
        // console.log(this.one);
        console.log(this.group);
    }
    _analyzeData() {
        this._one = this._one.slice(0, -1).replaceAll("NaN", "NA");
        let Acc = Math.round((this._groupset[0] * 100 / this.game_set) * 100) / 100;
        let RT = Math.round((this._groupset[1] / this._groupset[0]) * 100) / 100;
        let Positive = Math.round((this._groupset[2] / this._group_time[0]) * 100) / 100;
        let Negative = Math.round((this._groupset[3] / this._group_time[1]) * 100) / 100;
        let Middle = Math.round((this._groupset[4] / this._group_time[2]) * 100) / 100;
        this._group = (Acc + "_" + RT + "_" + Positive + "_" + Negative + "_" + Middle).replaceAll("NaN", "NA");
        RT=RT.toString().replaceAll("NaN",3000);
        this._pr = (Acc + "_" + RT + "_" + Positive + "_" + Negative + "_" + Middle).replaceAll("NaN", "NA");
    }
    get one() {
        return this._one;
    }
    get group() {
        return this._group;
    }
    get pr() {
        return this._pr;
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

function show(obj, obj_style = "block") {
    if (obj != null) {
        if (Array.isArray(obj)) {
            obj.forEach(element => {
                element.style.display = obj_style;
            });
        } else {
            obj.style.display = obj_style;
        }
    }
    // if (obj != null)
    //     obj.style.display = "inline-block";
}

function getKeyByValue(object, value) {
    // console.log(object);
    // console.log(value);
    return Object.keys(object).find(key => object[key] === value);
}