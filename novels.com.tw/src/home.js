function execute() {
    return Response.success([
        {"title": "All", "input": "/nosort/{0}/", "script": "gen.js"},
        {"title": "玄幻魔法", "input": "/nosort/{0}/1/", "script": "gen.js"},
        {"title": "武侠修真", "input": "/nosort/2/{0}/", "script": "gen.js"},
        {"title": "都市言情", "input": "/nosort/3/{0}/", "script": "gen.js"},
        {"title": "历史军事", "input": "/nosort/4/{0}/", "script": "gen.js"},
        {"title": "科幻灵异", "input": "/nosort/5/{0}/", "script": "gen.js"},
        {"title": "游戏竞技", "input": "/nosort/6/{0}/", "script": "gen.js"},
        {"title": "其他类型", "input": "/nosort/9/{0}/", "script": "gen.js"},
        {"title": "短篇", "input": "/nosort/10/{0}/", "script": "gen.js"},
        {"title": "成人小说", "input": "/nosort/11/{0}/", "script": "gen.js"},
        {"title": "肉文小说", "input": "/nosort/12/{0}/", "script": "gen.js"},
        {"title": "精肉", "input": "/nosort/13/{0}/", "script": "gen.js"},
        {"title": "女生耽美", "input": "/nosort/7/{0}/", "script": "gen.js"},
    ]);
}