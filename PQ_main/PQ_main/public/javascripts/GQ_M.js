class M {
    constructor(dataList, ID, password) {
        this.dataList = dataList;
        this.player = videojs('MyVideo', {
            width: "600",
            height: "400px",
            controls: true,
            autoplay: false,
            preload: "auto",
            muted: true
        });
        this.ID = ID;
        this.password = password;
    }

    //method
    Go(round) {
        function randomsort(a, b) {
            return Math.random() > .5 ? -1 : 1;
            //用Math.random()函式生成0~1之間的隨機數與0.5比較，返回-1或1
        }

        //one:回傳數據, player:播放器,order:隨機順序,round:第幾回合,feedback是否回傳數據(練習模式不回傳)
        var ID = this.ID;
        var password = this.password;
        var origin_round = round;
        var one = "";
        var player = this.player;
        var order = [];
        var data = this.dataList;
        var feedback = true;
        if (round <= 5)
            feedback = false;
        //建立order隨機順序
        for (var i = 0; i < round; i++)
            order.push(i);
        order.sort(randomsort);
    }
}