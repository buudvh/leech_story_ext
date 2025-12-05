function execute() {
    return Response.success([
        { title: "Home", input: "/sort/", script: "gen.js" },
        { title: "同人", input: "/sort/9/", script: "gen.js" },
        { title: "玄幻", input: "/sort/1/", script: "gen.js" },
        { title: "仙侠", input: "/sort/2/", script: "gen.js" },
        { title: "都市", input: "/sort/3/", script: "gen.js" },
        { title: "歷史", input: "/sort/4/", script: "gen.js" },
        { title: "遊戲", input: "/sort/5/", script: "gen.js" },
        { title: "科幻", input: "/sort/6/", script: "gen.js" },
        { title: "言情", input: "/sort/8/", script: "gen.js" },
    ]);
}