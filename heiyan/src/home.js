// input của gen.js: <thể loại>_<số chữ>_<miễn phí>_<hoàn thành>_<sắp xếp> (trang nối thêm ở gen.js)
function execute() {
    return Response.success([
        { title: "最新更新", input: "-1_-1_-1_-1_0", script: "gen.js" },
        { title: "周人气", input: "-1_-1_-1_-1_1", script: "gen.js" },
        { title: "月人气", input: "-1_-1_-1_-1_2", script: "gen.js" },
        { title: "总人气", input: "-1_-1_-1_-1_3", script: "gen.js" },
        { title: "推荐票", input: "-1_-1_-1_-1_4", script: "gen.js" },
        { title: "免费作品", input: "-1_-1_1_-1_1", script: "gen.js" },
        { title: "已完结", input: "-1_-1_-1_1_3", script: "gen.js" },
    ]);
}
