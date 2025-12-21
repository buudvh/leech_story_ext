function execute() {
    return Response.success([
        {"title": "Update", "input": "/news_last/index_{0}.html", "script": "gen.js"},
        {"title": "精品小說", "input": "/book/index_{0}.html", "script": "gen.js"},
        {"title": "都市小說", "input": "/dsxs/index_{0}.html", "script": "gen.js"},
        {"title": "玄幻修真", "input": "/xh/index_{0}.html", "script": "gen.js"},
        {"title": "歷史軍事", "input": "/lishi/index_{0}.html", "script": "gen.js"},
        {"title": "科幻競技", "input": "/khjj/index_{0}.html", "script": "gen.js"},
        {"title": "穿越架空", "input": "/cyjk/index_{0}.html", "script": "gen.js"},
        {"title": "鬼話懸疑", "input": "/guihua/index_{0}.html", "script": "gen.js"},
        {"title": "同人小說", "input": "/tongren/index_{0}.html", "script": "gen.js"}
    ]);
}