// Phân loại theo kênh nam (gender=0) / nữ (gender=1); bỏ các phân loại gần như rỗng (体育, 轻小说, 豪门总裁).
function execute() {
    return Response.success([
        { title: "都市", input: "gender=0&classificationId=4&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "玄幻", input: "gender=0&classificationId=13&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "历史", input: "gender=0&classificationId=17&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "科幻", input: "gender=0&classificationId=16&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "游戏", input: "gender=0&classificationId=18&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "奇幻", input: "gender=0&classificationId=9&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "现实", input: "gender=0&classificationId=21&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "仙侠", input: "gender=0&classificationId=12&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "推理", input: "gender=0&classificationId=20&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "武侠", input: "gender=0&classificationId=19&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "现代言情", input: "gender=1&classificationId=10&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "古代言情", input: "gender=1&classificationId=5&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "玄幻言情", input: "gender=1&classificationId=3&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "N次元", input: "gender=1&classificationId=29&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "悬疑灵异", input: "gender=1&classificationId=26&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "浪漫青春", input: "gender=1&classificationId=6&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "仙侠奇缘", input: "gender=1&classificationId=7&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "科幻空间", input: "gender=1&classificationId=28&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "穿越重生", input: "gender=1&classificationId=1&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
        { title: "游戏竞技", input: "gender=1&classificationId=27&bookIsFinished=-1&sortTitle=0", script: "gen.js" },
    ]);
}
