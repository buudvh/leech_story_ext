function execute() {
    return Response.success([
        { title: "诸天", input: "诸天", script: "search.js" },
        { title: "聊天群", input: "聊天群", script: "search.js" },
        { title: "万界", input: "万界", script: "search.js" },
        { title: "无限", input: "无限", script: "search.js" },
        { "title": "玄幻", "input": "/list/玄幻.html", "script": "gen.js" },
        { "title": "奇幻", "input": "/list/奇幻.html", "script": "gen.js" },
        { "title": "武侠", "input": "/list/武侠.html", "script": "gen.js" },
        { "title": "仙侠", "input": "/list/仙侠.html", "script": "gen.js" },
        { "title": "都市", "input": "/list/都市.html", "script": "gen.js" },
        { "title": "言情", "input": "/list/言情.html", "script": "gen.js" },
        { "title": "军事", "input": "/list/军事.html", "script": "gen.js" },
        { "title": "历史", "input": "/list/历史.html", "script": "gen.js" },
        { "title": "科幻", "input": "/list/科幻.html", "script": "gen.js" },
        { "title": "悬疑", "input": "/list/悬疑.html", "script": "gen.js" }
    ]);
}
