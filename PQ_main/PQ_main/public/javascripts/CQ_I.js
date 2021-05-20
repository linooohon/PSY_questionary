//_ => ~ => -
class I {
    constructor(isExercise) {
        this._mode = isExercise;
        this._patternSpeed = [];
        this._ctxSetting = {
            CIRCLE_COLOR: 'green',
            CIRCLE_RADIUS: 40,
            CANVAS_BORDER: '1px solid #000000',
        }
    }
    _start() {
        let timeline = [];
        let patternSpeedArray = [];
        let chooseMode = {
            type: 'html-keyboard-response',
            stimulus: `
				<p>請選擇模式:</p>
				<p>按 A 為水平模式<br>按 B 為垂直模式<br>按 C 為左斜模式<br>按 D 為右斜模式<br>按 E 為圓模式<br>按 F 為8字型模式<br>按 G 為水平8字型模式</p>
				<h1>選完模式後，接著請眼球專心跟著圖形移動</h1>`,
            post_trial_gap: 100,
            choices: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'Escape'],
        };
        let chooseSpeed = {
            type: 'html-keyboard-response',
            stimulus: '從 0~9 選一個數字，移動速度分為 0~9，共 10 段。0 為最慢速，9 為最快速。',
            post_trial_gap: 100,
            choices: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Escape'],
        };
        timeline.push(chooseMode);
        timeline.push(chooseSpeed);
        return new Promise((resolve) =>
            jsPsych.init({
                timeline: timeline,
                on_finish: function () {
                    let data = JSON.parse(jsPsych.data.get().json());
                    patternSpeedArray.push(data[0].response.toUpperCase(), Number(data[1].response) + 1);
                    resolve(patternSpeedArray);
                },
            })
        );
    }
    _full_trail(patternSpeedArray) {
        let timeline = [];
        let ctxSetting = this._ctxSetting;
        let ten = {
            type: 'html-keyboard-response',
            stimulus:
                "<p style='font-size: 30px; font-weight: bold; color: black'>+</p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 1000,
        }
        timeline.push(ten);

        let canvas = {
            type: 'html-keyboard-response',
            stimulus: '<canvas id="circle"></canvas>',
            choices: jsPsych.NO_KEYS,
            trial_duration: 30000,
            post_trial_gap: 200,
            on_load: function () {
                makeStaticGreenCircle(ctxSetting);
                setTimeout(() => {
                    pickPattern(patternSpeedArray, ctxSetting);
                }, 1000);
                console.log(1);
            }
        }
        timeline.push(canvas);

        return new Promise((resolve) => {
            jsPsych.init({
                timeline: timeline,
                on_finish: function (resolve) {
                    window.location.reload();
                    resolve("NO Return");
                }
            })
        })
    }
    async process() {
        this._patternSpeed = await this._start();
        console.log(this._patternSpeed);
        let result = await this._full_trail(this._patternSpeed);
        return result;
    }
}

const pickPattern = (patternSpeedArray, ctxSetting) => {
    switch (patternSpeedArray[0]) {
        case 'A':
            horizontal(patternSpeedArray[1], ctxSetting);
            break;
        case 'B':
            vertical(patternSpeedArray[1], ctxSetting);
            break;
        case 'C':
            upperLeftLowerRight(patternSpeedArray[1], ctxSetting);
            break;
        case 'D':
            upperRightLowerLeft(patternSpeedArray[1], ctxSetting);
            break;
        case 'E':
            circle(patternSpeedArray[1], ctxSetting);
            break;
        case 'F':
            eight(patternSpeedArray[1], true, ctxSetting);
            break;
        case 'G':
            eight(patternSpeedArray[1], false, ctxSetting);
            break;
        default:
            break;
    }
}

//做固定圓形
const makeStaticGreenCircle = (ctxSetting) => {
    //定義畫布
    let cvs = document.getElementById("circle");
    let ctx = cvs.getContext("2d");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    cvs.style.border = ctxSetting.CANVAS_BORDER;

    //在畫布上做圓形
    ctx.beginPath(); // 重置路徑
    ctx.arc(cvs.width / 2, cvs.height / 2, ctxSetting.CIRCLE_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = ctxSetting.CIRCLE_COLOR;
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}

//水平
const horizontal = (speed, ctxSetting) => {
    //定義畫布
    let cvs = document.getElementById("circle");
    let ctx = cvs.getContext("2d");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    cvs.style.border = ctxSetting.CANVAS_BORDER;

    let x = 0;
    let flag = true;
    let interval = 0;
    let timer = new Date().getTime();

    //不斷做圓形又清掉又做圓形
    function draw() {
        //不斷改變繪製物件水平位置
        if (flag) {
            x += 3 * speed;
            if (x >= cvs.width - 100) {
                flag = false;
            }
        } else {
            x -= 3 * speed;
            if (x <= 100) {
                flag = true;
            }
        }
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.beginPath();
        ctx.fillStyle = ctxSetting.CIRCLE_COLOR;
        ctx.arc(x, cvs.height / 2, ctxSetting.CIRCLE_RADIUS, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        if (timer + 30000 < new Date().getTime()) {
            clearInterval(interval);
        }
    }
    interval = setInterval(draw, 17);
}

//垂直
const vertical = (speed, ctxSetting) => {
    //定義畫布
    let cvs = document.getElementById("circle");
    let ctx = cvs.getContext("2d");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    cvs.style.border = ctxSetting.CANVAS_BORDER;

    let y = 0;
    let flag = true;
    let interval = 0;

    //不斷做圓形又清掉又做圓形
    function draw() {
        //不斷改變繪製物件垂直位置
        if (flag) {
            y += 3 * speed;
            if (y >= cvs.height - 100) {
                flag = false;
            }
        } else {
            y -= 3 * speed;
            if (y <= 100) {
                flag = true;
            }
        }
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.beginPath();
        ctx.fillStyle = ctxSetting.CIRCLE_COLOR;
        ctx.arc(cvs.width / 2, y, ctxSetting.CIRCLE_RADIUS, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        if (timer + 30000 < new Date().getTime()) {
            clearInterval(interval);
        }
    }
    interval = setInterval(draw, 17);
}

//左上右下
const upperLeftLowerRight = (speed, ctxSetting) => {
    //定義畫布
    let cvs = document.getElementById("circle");
    let ctx = cvs.getContext("2d");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    cvs.style.border = ctxSetting.CANVAS_BORDER;
    let diagonal = Math.pow(cvs.width ** 2 + cvs.height ** 2, 0.5);

    let x = 0;
    let y = 0;
    let path = 0;
    let flag = true;
    let interval = 0;

    //不斷做圓形又清掉又做圓形
    function draw() {
        if (flag) {
            y += 3 * speed;
            x += 6 * speed;
            path = Math.pow(x ** 2 + y ** 2, 0.5);
            if (path >= diagonal - 100) {
                flag = false;
            }
        } else {
            y -= 3 * speed;
            x -= 6 * speed;
            path = Math.pow(x ** 2 + y ** 2, 0.5);
            if (path <= 100) {
                flag = true;
            }
        }
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.beginPath();
        ctx.fillStyle = ctxSetting.CIRCLE_COLOR;
        ctx.arc(x, y, ctxSetting.CIRCLE_RADIUS, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        if (timer + 30000 < new Date().getTime()) {
            clearInterval(interval);
        }
    }
    interval = setInterval(draw, 17);
}

//右上左下
const upperRightLowerLeft = (speed, ctxSetting) => {
    //定義畫布
    let cvs = document.getElementById("circle");
    let ctx = cvs.getContext("2d");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    cvs.style.border = ctxSetting.CANVAS_BORDER;

    let x = 0;
    let y = cvs.height;
    let flag = true;
    let interval = 0;

    //不斷做圓形又清掉又做圓形
    function draw() {
        if (flag) {
            y -= 3 * speed;
            x += 6 * speed;
            if (y <= 100) {
                flag = false;
            }
        } else {
            y += 3 * speed;
            x -= 6 * speed;
            if (y >= cvs.height - 100) {
                flag = true;
            }
        }
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.beginPath();
        ctx.fillStyle = ctxSetting.CIRCLE_COLOR;
        ctx.arc(x, y - 20, ctxSetting.CIRCLE_RADIUS, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        if (timer + 30000 < new Date().getTime()) {
            clearInterval(interval);
        }
    }
    interval = setInterval(draw, 17);
}

//繞圓
const circle = (speed, ctxSetting) => {
    //定義畫布
    let cvs = document.getElementById("circle");
    let ctx = cvs.getContext("2d");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    cvs.style.border = ctxSetting.CANVAS_BORDER;

    const velocity = 0.015 * speed;
    let angle = 0;

    //不斷做圓形又清掉又做圓形
    function draw() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        let x = cvs.width / 2 + Math.cos(angle) * 300;
        let y = cvs.height / 2 + Math.sin(angle) * 300;

        ctx.beginPath();
        ctx.fillStyle = ctxSetting.CIRCLE_COLOR;
        ctx.arc(x, y, ctxSetting.CIRCLE_RADIUS, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        angle = angle >= 360 ? 0 : angle + velocity;
        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
}


//draw 8
const eight = (speed, isEight, ctxSetting) => {
    //定義畫布
    let cvs = document.getElementById('circle');
    let ctx = cvs.getContext('2d');
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    cvs.style.border = ctxSetting.CANVAS_BORDER;

    let length = 500;
    let count = 20;
    let interval = 0;
    let timer = new Date().getTime();
    let xyArray = [];
    let delta = 0.000002;
    let time = 0;

    function draw() {
        let xyArray = makeX_Y(delta);
        let finalXYArray = constantSpeed(xyArray[0], xyArray[1], 5, delta, count);
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.beginPath();
        ctx.fillStyle = ctxSetting.CIRCLE_COLOR;
        isEight
            ? ctx.arc(finalXYArray[1] + cvs.width / 2, cvs.height / 2 + finalXYArray[0], ctxSetting.CIRCLE_RADIUS, 0, 2 * Math.PI, true)
            : ctx.arc(finalXYArray[0] + cvs.width / 2, cvs.height / 2 + finalXYArray[1], ctxSetting.CIRCLE_RADIUS, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        if (timer + 30000 < new Date().getTime()) {
            clearInterval(interval);
        }
    }

    function makeX_Y(delta) {
        time += delta * speed;
        const x = (length * Math.cos(time)) / (1 + Math.pow(2, Math.sin(time)));
        const y = (length * Math.cos(time) * Math.sin(time)) / (1 + Math.pow(2, Math.sin(time)));
        xyArray[0] = x;
        xyArray[1] = y;
        return xyArray;
    }

    function constantSpeed(oldX, oldY, criticalPoint, delta, count) {

        if (count == 0) {
            return makeX_Y(delta);
        }
        let newXYArray = makeX_Y(delta);
        let distance = Math.sqrt((newXYArray[0] - oldX) ** 2 + (newXYArray[1] - oldY) ** 2);
        if (distance > criticalPoint) {
            return constantSpeed(newXYArray[0], newXYArray[1], criticalPoint, delta - delta / 2, count - 1);
        } else {
            return constantSpeed(newXYArray[0], newXYArray[1], criticalPoint, delta + delta / 2, count - 1);
        }
    }
    interval = setInterval(draw, 20);
};