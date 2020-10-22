class L {
    constructor(dataList) {
        this.dataList = dataList;
        this._one = "";
        this.player = videojs('MyVideo', {
            sources: [{ src: "", type: 'video/mp4' }],
            width: "600",
            height: "400px",
            controls: false,
            autoplay: true
        });
    }

    //method
    Go(round) {
        function randomsort(a, b) {
            return Math.random() > .5 ? -1 : 1;
            //用Math.random()函式生成0~1之間的隨機數與0.5比較，返回-1或1
        }
        var player = this.player;
        var order = [];
        var data = this.dataList;
        for (var i = 0; i < round; i++)
            order.push(i);
        order.sort(randomsort);
        //console.log(this.dataList)
        //console.log(order)
        round--;
        var path = "http://140.116.183.54:1340?path=video/L/" + data[order[round]].human + "/" + data[order[round]].filepath;
        player.src({
            src: path,
            type: 'video/mp4'
        });
        player.on("ended", () => {
            console.log("結束影片" + data[order[round]].filepath);
            round--;
            //第一階段結束
            $("#net").show();
            $("#MyVideo").hide();
            $("#warning").text("請選擇你覺得球落在哪, 再用滑鼠點擊該位置");
            $("#table").show(function () {
                $("#table").one('click', function (e) {
                    var offset = $(this).offset();
                    var x = (e.pageX - offset.left) * (7 / 15);
                    var y = (e.pageY - offset.top - 270) * -1 * (5 / 9);
                    console.log("X:" + x);
                    console.log("Y:" + y)
                    $("#table").hide();
                    $("#Canvas").show();
                    var c = document.getElementById("Canvas");
                    var ctx = c.getContext("2d");
                    var ctx2 = c.getContext("2d");
                    ctx.beginPath();
                    ctx.arc((e.pageX - offset.left), e.pageY - offset.top, 10, 0, 2 * Math.PI);
                    ctx.fillStyle = "#46C7C7";
                    ctx.fill();
                    ctx.stroke();
                    //第二個圓
                    ctx2.beginPath();
                    ctx2.arc(data[order[round + 1]].X * (15 / 7), data[order[round + 1]].Y * (-5 / 9) + 270, 10, 0, 2 * Math.PI);
                    ctx2.fillStyle = "#F76541";
                    ctx2.fill();
                    ctx2.stroke();
                    setTimeout(function () {
                        //第二階段結束
                        var tc = document.getElementById("Canvas");
                        tc.height = tc.height;
                        $("#Canvas").hide();
                        $("#net").hide();
                        $("#warning").text("請選擇你覺得球怎麼旋轉");
                        $("#Select").show();
                        $("#confirm").show(function () {
                            $("#confirm").one("click", function () {
                                console.log($("#Select").val());
                                $("#warning").text("");
                                $("#Select").hide();
                                $("#confirm").hide();
                                $("#MyVideo").show(function () {
                                    //下一輪開始
                                    if (round >= 0) {
                                        path = "http://140.116.183.54:1340?path=video/L/" + data[order[round]].human + "/" + data[order[round]].filepath;
                                        player.src({
                                            src: path,
                                            type: 'video/mp4'
                                        });
                                        console.log("開始影片" + order[round]);
                                    }
                                    else {
                                        location.reload();
                                    }
                                });
                            })
                        });
                    }, 1000);
                });
            });
        })
    }
}