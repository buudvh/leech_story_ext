function execute() {
    return Response.success([
        { "title": "最新", "input":  BASE_URL + "/latest/", "script": "gen.js"},
        { "title": "排行", "input": BASE_URL + "/ranking/", "script": "gen.js" },
        { "title": "诸天", "input": BASE_URL + "/zhutian/", "script": "gen.js" },
        { "title": "同人", "input": BASE_URL + "/erciyuan/", "script": "gen.js" },
        { "title": "玄幻", "input": BASE_URL + "/xuanhuan/", "script": "gen.js" },
        { "title": "修真", "input": BASE_URL + "/xiuzhen/", "script": "gen.js" },
        { "title": "都市", "input": BASE_URL + "/ds/", "script": "gen.js" },
        { "title": "网游", "input": BASE_URL + "/wangyou/", "script": "gen.js" },
        { "title": "科幻", "input": BASE_URL + "/kehuan/", "script": "gen.js" },
        { "title": "穿越", "input": BASE_URL + "/chuanyue/", "script": "gen.js" },
        { "title": "武侠", "input": BASE_URL + "/wuxia/", "script": "gen.js" },
        { "title": "历史", "input": BASE_URL + "/lishi/", "script": "gen.js" },
        { "title": "军事", "input": BASE_URL + "/junshi/", "script": "gen.js" },
        { "title": "奇幻", "input": BASE_URL + "/qihuan/", "script": "gen.js" },
        { "title": "悬疑", "input": BASE_URL + "/guihua/", "script": "gen.js" },
        { "title": "言情", "input": BASE_URL + "/yq/", "script": "gen.js" },
    ]);
}