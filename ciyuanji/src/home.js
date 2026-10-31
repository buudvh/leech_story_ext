// input của gen.js: <phân loại>_<số chữ>_<tình trạng>_<thu phí>_<sắp xếp> (trang nối thêm ở gen.js)
function execute() {
    return Response.success([
        { title: "人气", input: "0_0_0_0_1", script: "gen.js" },
        { title: "畅销", input: "0_0_0_0_2", script: "gen.js" },
        { title: "最近更新", input: "0_0_0_0_3", script: "gen.js" },
        { title: "最近上架", input: "0_0_0_0_4", script: "gen.js" },
        { title: "最近发布", input: "0_0_0_0_5", script: "gen.js" },
        { title: "免费作品", input: "0_0_0_1_1", script: "gen.js" },
        { title: "已完本", input: "0_0_1_0_1", script: "gen.js" },
    ]);
}
