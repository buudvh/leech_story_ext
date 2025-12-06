function execute() {
    return Response.success([
        { "title": "推荐榜", "input": "/rk/5/0/{0}.html", "script": "gen.js" },
        { "title": "阅读指数榜", "input": "/rk/3/0/{0}.html", "script": "gen.js" },
        { "title": "粉丝榜", "input": "/rk/4/0/{0}.html", "script": "gen.js" },
        { "title": "热度榜", "input": "/rk/2/0/{0}.html", "script": "gen.js" },
        { "title": "点击榜", "input": "/rk/1/0/{0}.html", "script": "gen.js" },
        { "title": "收藏榜", "input": "/rk/6/0/{0}.html", "script": "gen.js" },
    ]);
}