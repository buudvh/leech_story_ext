// input của gen.js: đường dẫn trang HTML "/l/..." (một trang) hoặc classify_id (API, nhiều trang).
// Bỏ /l/s/29, 30, 31 (男生必读, 女生爱看, 小编推荐): còn nhiều truyện đã gỡ (404).
function execute() {
    return Response.success([
        { title: "男频精选", input: "/l/sc/0/11.html", script: "gen.js" },
        { title: "女频精选", input: "/l/sc/0/21.html", script: "gen.js" },
        { title: "重磅推荐", input: "/l/s/28/1.html", script: "gen.js" },
        { title: "都市人生", input: "1100", script: "gen.js" },
        { title: "玄幻奇幻", input: "1101", script: "gen.js" },
        { title: "豪门总裁", input: "2106", script: "gen.js" },
        { title: "现代言情", input: "2100", script: "gen.js" },
    ]);
}
