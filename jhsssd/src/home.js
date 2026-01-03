function execute() {
    return Response.success([
        {"title": "最近更新", "input": "/Ranking_lastupdate/{0}.html", "script": "gen.js"},
        {"title": "最新入库", "input": "/Ranking_postdate/{0}.html", "script": "gen.js"},
        {"title": "日点击榜", "input": "/Ranking_dayvisit/{0}.html", "script": "gen.js"},
        {"title": "周点击榜", "input": "/Ranking_weekvisit/{0}.html", "script": "gen.js"},
        {"title": "月点击榜", "input": "/Ranking_monthvisit/{0}.html", "script": "gen.js"},
        {"title": "总点击榜", "input": "/Ranking_allvisit/{0}.html", "script": "gen.js"},
        {"title": "周推荐榜", "input": "/Ranking_weekvote/{0}.html", "script": "gen.js"},
        {"title": "月推荐榜", "input": "/Ranking_monthvote/{0}.html", "script": "gen.js"},
        {"title": "总推荐榜", "input": "/Ranking_allvote/{0}.html", "script": "gen.js"},
        {"title": "收藏推荐", "input": "/Ranking_goodnum/{0}.html", "script": "gen.js"},
        {"title": "字数排行", "input": "/Ranking_size/{0}.html", "script": "gen.js"},
        {"title": "新书榜单", "input": "/Ranking_goodnew/{0}.html", "script": "gen.js"},
        {"title": "玄幻小说", "input": "/list/1.html", "script": "gen2.js"},
        {"title": "修真小说", "input": "/list/2.html", "script": "gen2.js"},
        {"title": "都市小说", "input": "/list/3.html", "script": "gen2.js"},
        {"title": "穿越小说", "input": "/list/4.html", "script": "gen2.js"},
        {"title": "网游小说", "input": "/list/5.html", "script": "gen2.js"},
        {"title": "科幻小说", "input": "/list/6.html", "script": "gen2.js"},
        {"title": "灵异小说", "input": "/list/7.html", "script": "gen2.js"},
        {"title": "女生小说", "input": "/list/8.html", "script": "gen2.js"},
        {"title": "其它小说", "input": "/list/9.html", "script": "gen2.js"},
        {"title": "完本小说", "input": "/wanben.html", "script": "gen2.js"}
    ]);
}