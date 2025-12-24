function execute() {
    return Response.success([
        { title: "Update", input: "/sort/{0}.html", script: "gen2.js" },
        { title: "诸天流", input: "/tag/%E8%AB%B8%E5%A4%A9%E6%B5%81/", script: "tag.js" },
        { title: "无限流", input: "/tag/%E6%97%A0%E9%99%90%E6%B5%81/", script: "tag.js" },
        { title: "同人", input: "/sort/9/{0}.html", script: "gen2.js" },
        { title: "玄幻", input: "/sort/1/{0}.html", script: "gen2.js" },
        { title: "仙侠", input: "/sort/2/{0}.html", script: "gen2.js" },
        { title: "都市", input: "/sort/3/{0}.html", script: "gen2.js" },
        { title: "歷史", input: "/sort/4/{0}.html", script: "gen2.js" },
        { title: "遊戲", input: "/sort/5/{0}.html", script: "gen2.js" },
        { title: "科幻", input: "/sort/6/{0}.html", script: "gen2.js" },
        { title: "言情", input: "/sort/8/{0}.html", script: "gen2.js" },
    ]);
}