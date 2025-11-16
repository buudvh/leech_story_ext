function execute() {
    return Response.success([
        {title: "玄幻", input: "/sort/1", script: "gen.js"},
        {title: "奇幻", input: "/sort/2", script: "gen.js"},
        {title: "武侠", input: "/sort/3", script: "gen.js"},
        {title: "仙侠", input: "/sort/4", script: "gen.js"},
        {title: "都市", input: "/sort/5", script: "gen.js"},
        {title: "军事", input: "/sort/6", script: "gen.js"},
        {title: "历史", input: "/sort/7", script: "gen.js"},
        {title: "游戏", input: "/sort/8", script: "gen.js"},
        {title: "竞技", input: "/sort/9", script: "gen.js"},
        {title: "科幻", input: "/sort/10", script: "gen.js"},
        {title: "悬疑", input: "/sort/11", script: "gen.js"},
    ]);
}