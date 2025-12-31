function execute() {
    return Response.success([
        {"title": "全部小说", "input": "/bookstore/quanbu/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
        {"title": "玄幻小说", "input": "/bookstore/xuanhuan/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
        {"title": "仙侠小说", "input": "/bookstore/xianxia/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
        {"title": "都市小说", "input": "/bookstore/dushi/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
        {"title": "历史小说", "input": "/bookstore/lishi/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
        {"title": "悬疑小说", "input": "/bookstore/xuanyi/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
        {"title": "网游小说", "input": "/bookstore/wangyou/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
        {"title": "科幻小说", "input": "/bookstore/kehuan/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
        {"title": "惊悚小说", "input": "/bookstore/jingsong/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
        {"title": "穿越小说", "input": "/bookstore/chuanyue/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"},
        {"title": "同人小说", "input": "/bookstore/tongren/default-0-0-0-0-0-0-{0}.html", "script": "gen.js"}
    ]);
}