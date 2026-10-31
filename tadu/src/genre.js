// sortType: 15 mặc định, 12 周人气, 0 最近更新, 14 最新发布
function execute() {
    return Response.success([
        { title: "东方玄幻", input: "category/listContinue?categoryId=99&sortType=15", script: "gen.js" },
        { title: "现代都市", input: "category/listContinue?categoryId=103&sortType=15", script: "gen.js" },
        { title: "历史架空", input: "category/listContinue?categoryId=108&sortType=15", script: "gen.js" },
        { title: "军事战争", input: "category/listContinue?categoryId=113&sortType=15", script: "gen.js" },
        { title: "武侠仙侠", input: "category/listContinue?categoryId=109&sortType=15", script: "gen.js" },
        { title: "科幻末世", input: "category/listContinue?categoryId=111&sortType=15", script: "gen.js" },
        { title: "灵异悬疑", input: "category/listContinue?categoryId=128&sortType=15", script: "gen.js" },
        { title: "西方奇幻", input: "category/listContinue?categoryId=107&sortType=15", script: "gen.js" },
        { title: "游戏竞技", input: "category/listContinue?categoryId=112&sortType=15", script: "gen.js" },
        { title: "脑洞创意", input: "category/listContinue?categoryId=135&sortType=15", script: "gen.js" },
        { title: "短篇小说", input: "category/listContinue?categoryId=281&sortType=15", script: "gen.js" },
        { title: "古代言情", input: "category/listContinue?categoryId=129&sortType=15", script: "gen.js" },
        { title: "幻想言情", input: "category/listContinue?categoryId=133&sortType=15", script: "gen.js" },
        { title: "现代言情", input: "category/listContinue?categoryId=104&sortType=15", script: "gen.js" },
        { title: "浪漫青春", input: "category/listContinue?categoryId=105&sortType=15", script: "gen.js" },
        { title: "悬疑小说", input: "category/listContinue?categoryId=288&sortType=15", script: "gen.js" },
        { title: "女频短篇", input: "category/listContinue?categoryId=291&sortType=15", script: "gen.js" },
    ]);
}
