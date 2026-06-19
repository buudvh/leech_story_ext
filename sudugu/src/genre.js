function execute() {
    return Response.success([
        { title: "玄幻小说", input: "xuanhuan", script: "gen.js" },
        { title: "仙侠小说", input: "xianxia", script: "gen.js" },
        { title: "都市小说", input: "dushi", script: "gen.js" },
        { title: "历史小说", input: "lishi", script: "gen.js" },
        { title: "军事小说", input: "junshi", script: "gen.js" },
        { title: "科幻小说", input: "kehuan", script: "gen.js" },
        { title: "言情小说", input: "yanqing", script: "gen.js" },
    ]);
}
