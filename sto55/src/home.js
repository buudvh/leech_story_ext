function execute() {
    return Response.success([
        { "title": "最近更新", "input": "/top/lastupdate_{0}.html", "script": "gen.js" },
        { "title": "最新入庫", "input": "/top/postdate_{0}.html", "script": "gen.js" },
        { "title": "總排行榜", "input": "/top/allvisit_{0}.html", "script": "gen.js" },
        { "title": "總推薦榜", "input": "/top/allvote_{0}.html", "script": "gen.js" },
        { "title": "月排行榜", "input": "/top/monthvisit_{0}.html", "script": "gen.js" },
        { "title": "月推薦榜", "input": "/top/monthvote_{0}.html", "script": "gen.js" },
        { "title": "周排行榜", "input": "/top/weekvisit_{0}.html", "script": "gen.js" },
        { "title": "周推薦榜", "input": "/top/weekvote_{0}.html", "script": "gen.js" },
        { "title": "總收藏榜", "input": "/top/goodnum_{0}.html", "script": "gen.js" }
    ]);
}