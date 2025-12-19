function execute() {
    return Response.success([
        {"title": "連載", "input": "/novel/class/lianzai/{0}.html", "script": "gen.js"},
        {"title": "玄幻", "input": "/novel/class/xuanhuan/{0}.html", "script": "gen.js"},
        {"title": "都市", "input": "/novel/class/dushi/{0}.html", "script": "gen.js"},
        {"title": "仙俠", "input": "/novel/class/wuxia/{0}.html", "script": "gen.js"},
        {"title": "言情", "input": "/novel/class/yaniqng/{0}.html", "script": "gen.js"},
        {"title": "遊戲", "input": "/novel/class/youxi/{0}.html", "script": "gen.js"},
        {"title": "科幻", "input": "/novel/class/kehuan/{0}.html", "script": "gen.js"},
        {"title": "懸疑", "input": "/novel/class/kongbu/{0}.html", "script": "gen.js"},
        {"title": "靈異", "input": "/novel/class/xuanhuan/{0}.html", "script": "gen.js"},
        {"title": "軍事", "input": "/novel/class/lishi/{0}.html", "script": "gen.js"},
        {"title": "現言", "input": "/novel/class/tongren/{0}.html", "script": "gen.js"},
        {"title": "其它", "input": "/novel/class/qita/{0}.html", "script": "gen.js"}
    ]);
}