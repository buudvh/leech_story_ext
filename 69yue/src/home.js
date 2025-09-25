function execute() {
    return Response.success([
        { title: "新书", input: "/api/list/0/0/4/{0}.json", script: "gen.js" },
        { title: "欢迎", input: "/api/list/0/0/1/{0}.json", script: "gen.js" },

        { title: "玄幻魔法 - new", input: "/api/list/1/0/4/{0}.json", script: "gen.js" },
        { title: "修真武侠 - new", input: "/api/list/2/0/4/{0}.json", script: "gen.js" },
        { title: "言情小说 - new", input: "/api/list/3/0/4/{0}.json", script: "gen.js" },
        { title: "历史军事 - new", input: "/api/list/4/0/4/{0}.json", script: "gen.js" },
        { title: "游戏竞技 - new", input: "/api/list/5/0/4/{0}.json", script: "gen.js" },
        { title: "科幻空间 - new", input: "/api/list/6/0/4/{0}.json", script: "gen.js" },
        { title: "悬疑惊悚 - new", input: "/api/list/7/0/4/{0}.json", script: "gen.js" },
        { title: "同人小说 - new", input: "/api/list/8/0/4/{0}.json", script: "gen.js" },
        { title: "都市小说 - new", input: "/api/list/9/0/4/{0}.json", script: "gen.js" },
        { title: "官场职场 - new", input: "/api/list/10/0/4/{0}.json", script: "gen.js" },
        { title: "穿越时空 - new", input: "/api/list/11/0/4/{0}.json", script: "gen.js" },
        { title: "青春校园 - new", input: "/api/list/12/0/4/{0}.json", script: "gen.js" },
        { title: "其他   - new", input: "/api/list/13/0/4/{0}.json", script: "gen.js" },
    ]);
}