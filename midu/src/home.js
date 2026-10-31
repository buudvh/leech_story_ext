// input của gen.js: tham số form của /fiction/search/channel (trang nối thêm ở gen.js); kênh 0 = mọi thể loại.
function execute() {
    return Response.success([
        { title: "推荐", input: "second_channel=0&status=0&rank=", script: "gen.js" },
        { title: "人气榜", input: "second_channel=0&status=0&rank=1", script: "gen.js" },
        { title: "热搜榜", input: "second_channel=0&status=0&rank=2", script: "gen.js" },
        { title: "飙升榜", input: "second_channel=0&status=0&rank=3", script: "gen.js" },
        { title: "好评榜", input: "second_channel=0&status=0&rank=5", script: "gen.js" },
        { title: "完结", input: "second_channel=0&status=1&rank=1", script: "gen.js" },
        { title: "连载", input: "second_channel=0&status=2&rank=1", script: "gen.js" },
    ]);
}
