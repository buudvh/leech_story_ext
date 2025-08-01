function execute() {
    var fxlist = [
        {
            title: "動漫同人",
            input: "https://uukanshu.cc/class_9_{0}.html",
            script: "gen.js"
        },
        //
        {
            title: "總收藏榜",
            input: "https://uukanshu.cc/top/allvisit_{0}.html",
            script: "gen.js"
        },
        {
            title: "總推薦榜",
            input: "https://uukanshu.cc/top/allvote_{0}.html",
            script: "gen.js"
        },
        {
            title: "月排行榜",
            input: "https://uukanshu.cc/top/monthvisit_{0}.html",
            script: "gen.js"
        },
        {
            title: "月推薦榜",
            input: "https://uukanshu.cc/top/monthvote_{0}.html",
            script: "gen.js"
        },
        {
            title: "周排行榜",
            input: "https://uukanshu.cc/top/weekvisit_{0}.html",
            script: "gen.js"
        },
        {
            title: "周推薦榜",
            input: "https://uukanshu.cc/top/weekvote_{0}.html",
            script: "gen.js"
        },
        {
            title: "最新入庫",
            input: "https://uukanshu.cc/top/postdate_{0}.html",
            script: "gen.js"
        },
        {
            title: "最近更新",
            input: "https://uukanshu.cc/top/lastupdate_{0}.html",
            script: "gen.js"
        },
        {
            title: "總收藏榜",
            input: "https://uukanshu.cc/top/goodnum_{0}.html",
            script: "gen.js"
        },

        //
        {
            title: "完本小說",
            input: "https://uukanshu.cc/quanben/{0}.html",
            script: "gen.js"
        },
        {
            title: "玄幻奇幻",
            input: "https://uukanshu.cc/class_1_{0}.html",
            script: "gen.js"
        },
        {
            title: "武俠仙俠",
            input: "https://uukanshu.cc/class_2_{0}.html",
            script: "gen.js"
        },
        {
            title: "武俠仙俠",
            input: "https://uukanshu.cc/class_3_{0}.html",
            script: "gen.js"
        },
        {
            title: "妖怪茶話會",
            input: "https://uukanshu.cc/class_5_{0}.html",
            script: "gen.js"
        },
        {
            title: "歷史軍事",
            input: "https://uukanshu.cc/class_4_{0}.html",
            script: "gen.js"
        },
        {
            title: "遊戲競技",
            input: "https://uukanshu.cc/class_6_{0}.html",
            script: "gen.js"
        },
        {
            title: "恐怖靈異",
            input: "https://uukanshu.cc/class_7_{0}.html",
            script: "gen.js"
        },
        {
            title: "其他類型",
            input: "https://uukanshu.cc/class_10_{0}.html",
            script: "gen.js"
        }
    ];

    return Response.success(fxlist);
}