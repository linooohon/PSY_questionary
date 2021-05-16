//_ => ~ => -
class I {
    constructor(isExercise) {
        this._mode = isExercise;
        this._patternSpeed = [];
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
            post_trial_gap: 1000,
            choices: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'Escape'],
        };
        let chooseSpeed = {
            type: 'html-keyboard-response',
            stimulus: '從 0~9 選一個數字，移動速度分為 0~9，共 10 段。0 為最慢速，9 為最快速。',
            post_trial_gap: 1000,
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

        let ten = {
            type: 'html-keyboard-response',
            stimulus:
                "<p style='font-size: 200px; font-weight: bold; color: black'>+</p>",
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
                makeStaticGreenCircle();
                setTimeout(() => {
                    pickPattern(patternSpeedArray);
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
        let result = await this._full_trail(this._patternSpeed);
        return result;
    }
}

const pickPattern = (patternSpeedArray) => {
    switch (patternSpeedArray[0]) {
        case 'A':
            horizontal(patternSpeedArray[1]);
            break;
        case 'B':
            vertical(patternSpeedArray[1]);
            break;
        case 'C':
            upperLeftLowerRight(patternSpeedArray[1]);
            break;
        case 'D':
            upperRightLowerLeft(patternSpeedArray[1]);
            break;
        case 'E':
            circle(patternSpeedArray[1]);
            break;
        case 'F':
            pattern = "F";
            break;
        case 'G':
            pattern = "G";
            break;
        default:
            break;
    }
}

//做固定圓形
const makeStaticGreenCircle = () => {

    //定義畫布
    let cvs = document.getElementById("circle");
    let ctx = cvs.getContext("2d");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    cvs.style.border = "1px solid #000000";

    //在畫布上做圓形
    ctx.beginPath(); // 重置路徑
    ctx.arc(cvs.width / 2, cvs.height / 2, 40, 0, 2 * Math.PI);
    ctx.fillStyle = "green";
    ctx.fill();
}

//水平
const horizontal = (speed) => {
    //定義畫布
    let cvs = document.getElementById("circle");
    let ctx = cvs.getContext("2d");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    cvs.style.border = "1px solid #000000";

    let x = 0;
    let flag = true;
    let interval = 0;
    let timer = new Date().getTime();

    //不斷做圓形又清掉又做圓形
    function draw() {
        //不斷改變繪製物件水平位置
        if (flag) {
            x += speed;
            if (x >= cvs.width - 100) {
                flag = false;
            }
        } else {
            x -= speed;
            if (x <= 100) {
                flag = true;
            }
        }
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.arc(x, cvs.height / 2, 40, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        if (timer + 30000 < new Date().getTime()) {
            clearInterval(interval);
        }
    }
    interval = setInterval(draw, 1);
}

//垂直
const vertical = (speed) => {
    //定義畫布
    let cvs = document.getElementById("circle");
    let ctx = cvs.getContext("2d");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    cvs.style.border = "1px solid #000000";

    let y = 0;
    let flag = true;

    //不斷做圓形又清掉又做圓形
    function draw() {
        //不斷改變繪製物件垂直位置
        if (flag) {
            y += speed;
            if (y >= cvs.height - 100) {
                flag = false;
            }
        } else {
            y -= speed;
            if (y <= 100) {
                flag = true;
            }
        }
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.arc(cvs.width / 2, y, 40, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
    setInterval(draw, 1);
}

//左上右下
const upperLeftLowerRight = (speed) => {
    //定義畫布
    let cvs = document.getElementById("circle");
    let ctx = cvs.getContext("2d");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    cvs.style.border = "1px solid #000000";
    let diagonal = Math.pow(cvs.width ** 2 + cvs.height ** 2, 0.5);

    //在畫布上做圓形
    ctx.beginPath(); // 重置路徑
    ctx.arc(cvs.width / 2, cvs.height / 2, 40, 0, 2 * Math.PI);
    ctx.fillStyle = "green";
    ctx.fill();

    let x = 0;
    let y = 0;
    let path = 0;
    let flag = true;

    //不斷做圓形又清掉又做圓形
    function draw() {
        //不斷改變繪製物件垂直位置
        if (flag) {
            y += speed;
            x += 2 * speed;
            path = Math.pow(x ** 2 + y ** 2, 0.5);
            if (path >= diagonal - 100) {
                flag = false;
            }
        } else {
            y -= speed;
            x -= 2 * speed;
            path = Math.pow(x ** 2 + y ** 2, 0.5);
            if (path <= 100) {
                flag = true;
            }
        }
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.arc(x, y, 40, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
    setInterval(draw, 1);
}

//右上左下
const upperRightLowerLeft = (speed) => {
    //定義畫布
    let cvs = document.getElementById("circle");
    let ctx = cvs.getContext("2d");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    cvs.style.border = "1px solid #000000";

    let x = 0;
    let y = cvs.height;
    let flag = true;

    //不斷做圓形又清掉又做圓形
    function draw() {
        //不斷改變繪製物件垂直位置
        if (flag) {
            y -= speed;
            x += 2 * speed;
            if (y <= 100) {
                flag = false;
            }
        } else {
            y += speed;
            x -= 2 * speed;
            if (y >= cvs.height - 100) {
                flag = true;
            }
        }
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.arc(x, y - 20, 40, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }
    setInterval(draw, 1);
}

//繞圓
const circle = (speed) => {
    //定義畫布
    let cvs = document.getElementById("circle");
    let ctx = cvs.getContext("2d");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    cvs.style.border = "1px solid #000000";

    const velocity = 0.015 * speed;
    let angle = 0;

    //不斷做圓形又清掉又做圓形
    function draw() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        let x = cvs.width / 2 + Math.cos(angle) * 300;
        let y = cvs.height / 2 + Math.sin(angle) * 300;

        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.arc(x, y, 40, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();

        angle = angle >= 360 ? 0 : angle + velocity;
        requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
}