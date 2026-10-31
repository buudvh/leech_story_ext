// input của gen.js: <kênh>|<khối>; khối = hot, update hoặc tiêu đề khối trên trang. Truyện đồng nhân nằm chủ yếu ở kênh nam.
function execute() {
    return Response.success([
        { title: "男频神作", input: "boy|神作推荐", script: "gen.js" },
        { title: "男频热门", input: "boy|hot", script: "gen.js" },
        { title: "男频编辑推荐", input: "boy|编辑推荐", script: "gen.js" },
        { title: "男频最近更新", input: "boy|update", script: "gen.js" },
        { title: "女频神作", input: "girl|神作推荐", script: "gen.js" },
        { title: "女频热门", input: "girl|hot", script: "gen.js" },
        { title: "女频编辑推荐", input: "girl|编辑推荐", script: "gen.js" },
        { title: "女频最近更新", input: "girl|update", script: "gen.js" },
    ]);
}
