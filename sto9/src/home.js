function execute() {
    return Response.success([
        {"title":"Update","input":"/novels/class/0_{0}.html","script":"gen.js"},
        {"title":"人气","input":"/novels/weekvisit_0_0_{0}.html","script":"gen.js"},
        {"title":"推荐","input":"/novels/allvote_0_0_{0}.html","script":"gen.js"},
        {"title":"新书","input":"/novels/newhot_0_0_{0}.html","script":"gen.js"},

        {"title":"諸天流","input":"/newtag/諸天流/{0}","script":"tag.js"},
        {"title":"无限流","input":"/newtag/无限流/{0}","script":"tag.js"},
        {"title":"動漫同人","input":"/novels/class/9_{0}.html","script":"gen.js"},
        {"title":"玄幻奇幻","input":"/novels/class/1_{0}.html","script":"gen.js"},
        {"title":"武俠仙俠","input":"/novels/class/2_{0}.html","script":"gen.js"},
        {"title":"現代都市","input":"/novels/class/3_{0}.html","script":"gen.js"},
        {"title":"歷史軍事","input":"/novels/class/4_{0}.html","script":"gen.js"},
        {"title":"科幻小說","input":"/novels/class/5_{0}.html","script":"gen.js"},
        {"title":"遊戲競技","input":"/novels/class/6_{0}.html","script":"gen.js"},
        {"title":"恐怖靈異","input":"/novels/class/7_{0}.html","script":"gen.js"},
        {"title":"言情小說","input":"/novels/class/8_{0}.html","script":"gen.js"},
        {"title":"其他類型","input":"/novels/class/10_{0}.html","script":"gen.js"},
    ]);
}