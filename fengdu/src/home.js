// input của gen.js: gender 0 nam / 1 nữ; sortTitle 0 热门, 1 最近更新, 2 评分; bookIsFinished 1 = đã hoàn thành.
function execute() {
    return Response.success([
        { title: "男生热门", input: "gender=0&classificationId=-1&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "男生最新", input: "gender=0&classificationId=-1&bookIsFinished=-1&sortTitle=1", script: "gen.js" },
        { title: "男生高分", input: "gender=0&classificationId=-1&bookIsFinished=-1&sortTitle=2", script: "gen.js" },
        { title: "男生完结", input: "gender=0&classificationId=-1&bookIsFinished=1&sortTitle=0", script: "gen.js" },
        { title: "女生热门", input: "gender=1&classificationId=-1&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "女生最新", input: "gender=1&classificationId=-1&bookIsFinished=-1&sortTitle=1", script: "gen.js" },
        { title: "女生高分", input: "gender=1&classificationId=-1&bookIsFinished=-1&sortTitle=2", script: "gen.js" },
        { title: "女生完结", input: "gender=1&classificationId=-1&bookIsFinished=1&sortTitle=0", script: "gen.js" },
    ]);
}
