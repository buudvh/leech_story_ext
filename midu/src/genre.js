// second_channel = categoryId của trang chi tiết (男频 trước, 女频 sau).
function execute() {
    return Response.success([
        { title: "玄幻", input: "second_channel=3&status=0&rank=", script: "gen.js" },
        { title: "都市", input: "second_channel=5&status=0&rank=", script: "gen.js" },
        { title: "推理", input: "second_channel=7&status=0&rank=", script: "gen.js" },
        { title: "仙侠", input: "second_channel=15&status=0&rank=", script: "gen.js" },
        { title: "科幻", input: "second_channel=27&status=0&rank=", script: "gen.js" },
        { title: "游戏", input: "second_channel=30&status=0&rank=", script: "gen.js" },
        { title: "武侠", input: "second_channel=32&status=0&rank=", script: "gen.js" },
        { title: "历史", input: "second_channel=35&status=0&rank=", script: "gen.js" },
        { title: "奇幻", input: "second_channel=39&status=0&rank=", script: "gen.js" },
        { title: "军事", input: "second_channel=93&status=0&rank=", script: "gen.js" },
        { title: "体育", input: "second_channel=47&status=0&rank=", script: "gen.js" },
        { title: "同人次元", input: "second_channel=61&status=0&rank=", script: "gen.js" },
        { title: "现代言情", input: "second_channel=13&status=0&rank=", script: "gen.js" },
        { title: "古代言情", input: "second_channel=17&status=0&rank=", script: "gen.js" },
        { title: "悬疑刑侦", input: "second_channel=24&status=0&rank=", script: "gen.js" },
        { title: "玄幻仙侠(女频)", input: "second_channel=41&status=0&rank=", script: "gen.js" },
        { title: "青春校园", input: "second_channel=51&status=0&rank=", script: "gen.js" },
        { title: "同人小说(女频)", input: "second_channel=68&status=0&rank=", script: "gen.js" },
        { title: "科幻空间(女频)", input: "second_channel=78&status=0&rank=", script: "gen.js" },
        { title: "游戏竞技(女频)", input: "second_channel=95&status=0&rank=", script: "gen.js" },
    ]);
}
