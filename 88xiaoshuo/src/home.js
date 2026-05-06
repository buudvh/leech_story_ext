function execute() {
    return Response.success([
        {"title":"最近更新","input":"/lastupdate/{0}/","script":"gen.js"},
        {"title":"总点击","input":"/allvisit/{0}/","script":"gen.js"},
        {"title":"月点击","input":"/monthvisit/{0}/","script":"gen.js"},
        {"title":"周点击","input":"/weekvisit/{0}/","script":"gen.js"},
        {"title":"日点击","input":"/dayvisit/{0}/","script":"gen.js"},
        {"title":"总推荐","input":"/allvote/{0}/","script":"gen.js"},
        {"title":"月推荐","input":"/monthvote/{0}/","script":"gen.js"},
        {"title":"周推荐","input":"/weekvote/{0}/","script":"gen.js"},
        {"title":"日推荐","input":"/dayvote/{0}/","script":"gen.js"},
        {"title":"总收藏","input":"/goodnum/{0}/","script":"gen.js"},
        {"title":"总字数","input":"/size/{0}/","script":"gen.js"},
        {"title":"最新入库","input":"/postdate/{0}/","script":"gen.js"},
        {"title":"强推榜","input":"/toptime/{0}/","script":"gen.js"},
        {"title":"新书榜","input":"/goodnew/{0}/","script":"gen.js"}
    ]);
}