function execute() {
    return Response.success([
        {"title": "最近更新", "input": "/lastupdate/{0}.html", "script": "gen.js"},
        {"title": "最新新書", "input": "/postdate/{0}.html", "script": "gen.js"},
        {"title": "日點擊榜", "input": "/dayvisit/{0}.html", "script": "gen.js"},
        {"title": "周點擊榜", "input": "/weekvisit/{0}.html", "script": "gen.js"},
        {"title": "月點擊榜", "input": "/monthvisit/{0}.html", "script": "gen.js"},
        {"title": "總點擊榜", "input": "/allvisit/{0}.html", "script": "gen.js"},
        {"title": "日推薦榜", "input": "/dayvote/{0}.html", "script": "gen.js"},
        {"title": "周推薦榜", "input": "/weekvote/{0}.html", "script": "gen.js"},
        {"title": "月推薦榜", "input": "/monthvote/{0}.html", "script": "gen.js"},
        {"title": "總推薦榜", "input": "/allvote/{0}.html", "script": "gen.js"},
        {"title": "字數排行", "input": "/size/{0}.html", "script": "gen.js"},
        {"title": "總收藏榜", "input": "/goodnum/{0}.html", "script": "gen.js"}
    ]);
}