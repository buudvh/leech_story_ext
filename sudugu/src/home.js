function execute() {
    return Response.success([
        { title: "最新更新", input: "zuixin", script: "gen.js" },
        { title: "完结小说", input: "wanjie", script: "gen.js" },
        { title: "排行榜", input: "paihang", script: "gen.js" },
        { title: "玄幻小说", input: "xuanhuan", script: "gen.js" },
        { title: "仙侠小说", input: "xianxia", script: "gen.js" },
        { title: "都市小说", input: "dushi", script: "gen.js" },
        { title: "历史小说", input: "lishi", script: "gen.js" },
        { title: "科幻小说", input: "kehuan", script: "gen.js" },
        { title: "言情小说", input: "yanqing", script: "gen.js" }
    ]);
}
