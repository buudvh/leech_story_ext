function execute() {
    return Response.success([
        {"title": "Update", "input": "/new/", "script": "gen.js"},
        {"title": "诸天流", "input": "/tags/%E8%AF%B8%E5%A4%A9%E4%B8%87%E7%95%8C", "script": "gen.js"},
        {"title": "无限流", "input": "/tags/%E6%97%A0%E9%99%90%E6%B5%81", "script": "gen.js"},
        {"title": "Hot", "input": "/hot/", "script": "gen.js"},
        {"title": "Hot month", "input": "/hot/month/", "script": "gen.js"},
        {"title": "Hot day", "input": "/hot/day/", "script": "gen.js"},
        {"title": "玄幻奇幻", "input": "/sort/1/index-0-0-0-{0}.html", "script": "gen2.js"},
        {"title": "傳統武俠", "input": "/sort/10/index-0-0-0-{0}.html", "script": "gen2.js"},
        {"title": "修真仙俠", "input": "/sort/2/index-0-0-0-{0}.html", "script": "gen2.js"},
        {"title": "都市青春", "input": "/sort/3/index-0-0-0-{0}.html", "script": "gen2.js"},
        {"title": "軍事歷史", "input": "/sort/4/index-0-0-0-{0}.html", "script": "gen2.js"},
        {"title": "網游競技", "input": "/sort/5/index-0-0-0-{0}.html", "script": "gen2.js"},
        {"title": "科幻靈異", "input": "/sort/6/index-0-0-0-{0}.html", "script": "gen2.js"},
        {"title": "言情穿越", "input": "/sort/7/index-0-0-0-{0}.html", "script": "gen2.js"},
        {"title": "耽美同人", "input": "/sort/8/index-0-0-0-{0}.html", "script": "gen2.js"},
        {"title": "台言古言", "input": "/sort/9/index-0-0-0-{0}.html", "script": "gen2.js"},
        {"title": "其他小說", "input": "/sort/0/index-0-0-0-{0}.html", "script": "gen2.js"}
    ]);
}