function execute() {
    return Response.success([
        {"title": "排行", "input": "/paihang", "script": "gen.js"},
        {"title": "连载", "input": "/lianzai", "script": "gen.js"},
        {"title": "完结", "input": "/wanjie", "script": "gen.js"},
        {"title": "玄幻", "input": "/xuanhuan", "script": "gen.js"},
        {"title": "轻小", "input": "/qing", "script": "gen.js"},
        {"title": "武侠", "input": "/wuxia", "script": "gen.js"},
        {"title": "仙侠", "input": "/xianxia", "script": "gen.js"},
        {"title": "奇幻", "input": "/qihuan", "script": "gen.js"},
        {"title": "科幻", "input": "/kehuan", "script": "gen.js"},
        {"title": "都市", "input": "/dushi", "script": "gen.js"},
        {"title": "军事", "input": "/junshi", "script": "gen.js"},
        {"title": "历史", "input": "/lishi", "script": "gen.js"},
        {"title": "游戏", "input": "/youxi", "script": "gen.js"},
        {"title": "体育", "input": "/tiyu", "script": "gen.js"},
        {"title": "悬疑", "input": "/xuanyi", "script": "gen.js"},
        {"title": "穿越", "input": "/chuanyue", "script": "gen.js"},
        {"title": "言情", "input": "/yanqing", "script": "gen.js"}
    ]);
}