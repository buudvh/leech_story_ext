function execute() {
    return Response.success([
        { title: "男-奇幻", input: "/books/nansheng?categoryId=1114", script: "zen.js" },
        { title: "男-玄幻", input: "/books/nansheng?categoryId=1115", script: "zen.js" },
        { title: "男-武侠", input: "/books/nansheng?categoryId=1116", script: "zen.js" },
        { title: "男-仙侠", input: "/books/nansheng?categoryId=1117", script: "zen.js" },
        { title: "男-都市", input: "/books/nansheng?categoryId=1118", script: "zen.js" },
        { title: "男-校园", input: "/books/nansheng?categoryId=1119", script: "zen.js" },
        { title: "男-历史", input: "/books/nansheng?categoryId=1120", script: "zen.js" },
        { title: "男-军事", input: "/books/nansheng?categoryId=1121", script: "zen.js" },
        { title: "男-游戏", input: "/books/nansheng?categoryId=1122", script: "zen.js" },
        { title: "男-竞技", input: "/books/nansheng?categoryId=1123", script: "zen.js" },
        { title: "男-科幻", input: "/books/nansheng?categoryId=1124", script: "zen.js" },
        { title: "男-灵异", input: "/books/nansheng?categoryId=1125", script: "zen.js" },
        { title: "人气热", input: "/bangdan/36014", script: "gen.js" },
        { title: "点击榜", input: "/bangdan/36015", script: "gen.js" },
        { title: "收藏榜", input: "/bangdan/36016", script: "gen.js" },
        { title: "新书潜力", input: "/bangdan/36017", script: "gen.js" },
        { title: "完本榜", input: "/bangdan/36021", script: "gen.js" },
    ]);
}