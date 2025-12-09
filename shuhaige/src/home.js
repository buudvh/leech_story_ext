function execute() {
    return Response.success([
        { title: "诸天", input: "诸天", script: "search.js" },
        {"title":"最近更新","input":"/lastupdate/{0}.html","script":"gen.js"},
        { title: "聊天群", input: "聊天群", script: "search.js" },
        { title: "万界", input: "万界", script: "search.js" },
        { title: "无限", input: "无限", script: "search.js" },
        { title: "同时穿越", input: "同时穿越", script: "search.js" },
        { title: "轮回", input: "轮回", script: "search.js" },
        {"title":"新书入库","input":"/postdate/{0}.html","script":"gen.js"},
        { "title": "全部分类", "input": "/shuku/dayvisit_0_0_{0}.html", "script": "gen2.js" },
        { "title": "玄幻", "input": "/shuku/dayvisit_1_0_{0}.html", "script": "gen2.js" },
        { "title": "奇幻", "input": "/shuku/dayvisit_2_0_{0}.html", "script": "gen2.js" },
        { "title": "武侠", "input": "/shuku/dayvisit_3_0_{0}.html", "script": "gen2.js" },
        { "title": "都市", "input": "/shuku/dayvisit_4_0_{0}.html", "script": "gen2.js" },
        { "title": "历史", "input": "/shuku/dayvisit_5_0_{0}.html", "script": "gen2.js" },
        { "title": "军事", "input": "/shuku/dayvisit_6_0_{0}.html", "script": "gen2.js" },
        { "title": "悬疑", "input": "/shuku/dayvisit_7_0_{0}.html", "script": "gen2.js" },
        { "title": "游戏", "input": "/shuku/dayvisit_8_0_{0}.html", "script": "gen2.js" },
        { "title": "科幻", "input": "/shuku/dayvisit_9_0_{0}.html", "script": "gen2.js" }
    ]);
}