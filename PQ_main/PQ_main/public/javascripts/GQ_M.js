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
        //one:回傳數據, player:播放器,order:隨機順序,round:第幾回合,feedback是否回傳數據(練習模式不回傳)
        var ID;
        var password;
        var origin_round;
        var one;
        var player = this.player;
        var data = this.dataList;
        var feedback;
        ID = this.ID;
        password = this.password;
        function init() {
            origin_round = round;
            if (round <= 5)
                feedback = false;
            else
                feedback = true;
            round--;
            var path = "http://140.116.183.54:1340/?path=video/M/" + data[round].filepath + ".mp4";
            player.src({
                src: path,
                type: 'video/mp4'
            });
            one = "";
            $("#Lplayer").text(data[round].names.split('/')[0]);
            $("#Rplayer").text(data[round].names.split('/')[1]);
            $(".row").show();
            $("#MyVideo").show();
            $("#question").hide();
        }
        init();
        

    }
}