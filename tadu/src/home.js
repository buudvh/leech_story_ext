// input của gen.js: đường dẫn listContinue (trang nối thêm ở gen.js)
function execute() {
    return Response.success([
        { title: "人气榜", input: "rank/listContinue?readLike=0&countType=hour72&categoryId=0&chars=0", script: "gen.js" },
        { title: "新书榜", input: "rank/listContinue?readLike=0&countType=potential&categoryId=0&chars=0", script: "gen.js" },
        { title: "银票榜", input: "rank/listContinue?readLike=0&countType=votes&categoryId=0&chars=0", script: "gen.js" },
        { title: "互动榜", input: "rank/listContinue?readLike=0&countType=interactive&categoryId=0&chars=0", script: "gen.js" },
        { title: "完本榜", input: "rank/listContinue?readLike=0&countType=wholebook&categoryId=0&chars=0", script: "gen.js" },
        { title: "女频人气榜", input: "rank/listContinue?readLike=3&countType=hour72&categoryId=0&chars=0", script: "gen.js" },
        { title: "女频完本榜", input: "rank/listContinue?readLike=3&countType=wholebook&categoryId=0&chars=0", script: "gen.js" },
    ]);
}
