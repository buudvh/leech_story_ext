function execute() {
    return Response.success([
        { title: "诸天", input: "诸天", script: "search.js" },
        { title: "聊天群", input: "聊天群", script: "search.js" },
        { title: "万界", input: "万界", script: "search.js" },
        { title: "无限", input: "无限", script: "search.js" },
        { title: "Home", input: "https://69shuba.tw/", script: "gen.js" },
        { title: "玄幻", input: "/fenlei/xuanhuan/1/", script: "gen2.js" },
        { title: "仙侠", input: "/fenlei/wuxia/1/", script: "gen2.js" },
        { title: "都市", input: "/fenlei/dushi/1/", script: "gen2.js" },
        { title: "歷史", input: "/fenlei/lishi/1/", script: "gen2.js" },
        { title: "遊戲", input: "/fenlei/youxi/1/", script: "gen2.js" },
        { title: "科幻", input: "/fenlei/kehu/1/", script: "gen2.js" },
        { title: "女生", input: "/fenlei/kongbu/1/", script: "gen2.js" },
        { title: "其他", input: "/fenlei/qita/1/", script: "gen2.js" },
    ]);
}