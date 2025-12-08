function execute() {
    return Response.success([
        { title: "Update", input: "/subcategory?categoryId=1432&page={0}&order=3", script: "gen.js" },
        { title: "Hot", input: "/subcategory?categoryId=1432&page={0}&order=1", script: "gen.js" },
        { title: "New", input: "/subcategory?categoryId=1432&page={0}&order=2", script: "gen.js" },
        { title: "Rate", input: "/subcategory?categoryId=1432&page={0}&order=4", script: "gen.js" },
        { title: "奇幻", input: "/subcategory?categoryId=1114&page={0}&order=3", script: "gen.js" },
        { title: "玄幻", input: "/subcategory?categoryId=1115&page={0}&order=3", script: "gen.js" },
        { title: "武侠", input: "/subcategory?categoryId=1116&page={0}&order=3", script: "gen.js" },
        { title: "仙侠", input: "/subcategory?categoryId=1117&page={0}&order=3", script: "gen.js" },
        { title: "都市", input: "/subcategory?categoryId=1118&page={0}&order=3", script: "gen.js" },
        { title: "校园", input: "/subcategory?categoryId=1119&page={0}&order=3", script: "gen.js" },
        { title: "历史", input: "/subcategory?categoryId=1120&page={0}&order=3", script: "gen.js" },
        { title: "军事", input: "/subcategory?categoryId=1121&page={0}&order=3", script: "gen.js" },
        { title: "游戏", input: "/subcategory?categoryId=1122&page={0}&order=3", script: "gen.js" },
        { title: "竞技", input: "/subcategory?categoryId=1123&page={0}&order=3", script: "gen.js" },
        { title: "科幻", input: "/subcategory?categoryId=1124&page={0}&order=3", script: "gen.js" },
        { title: "灵异", input: "/subcategory?categoryId=1125&page={0}&order=3", script: "gen.js" },
    ]);
}
