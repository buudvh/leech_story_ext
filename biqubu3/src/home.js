function execute() {
    return Response.success([
        { title: "诸天流", input: "/诸天流/{0}/", script: "gen2.js" },
        { title: "无限流", input: "/无限流/{0}/", script: "gen2.js" },

        {title: "诸天流 - 新入库", input: "chư thiên&new", script: "search.js"},
        {title: "诸天流 - 新更新", input: "chư thiên&update", script: "search.js"},
        {title: "诸天流 - 总阅读量", input: "chư thiên&view", script: "search.js"},
        {title: "诸天流 - 本周阅读量", input: "chư thiên&viewweek", script: "search.js"},
        {title: "诸天流 - 今日阅读量", input: "chư thiên&viewday", script: "search.js"},
        {title: "诸天流 - 点赞数", input: "chư thiên&like", script: "search.js"},
        {title: "诸天流 - 关注数", input: "chư thiên&following", script: "search.js"},
        {title: "诸天流 - 收藏数", input: "chư thiên&bookmarked", script: "search.js"},

        {title: "聊天群 - 新入库", input: "chat group&new", script: "search.js"},

        {title: "官场职场 - 新更新", input: "quantruongcholamviec,", script: "tag.js"},
        {title: "武侠 - 新更新", input: "vuhiep,", script: "tag.js"},
        {title: "时空 - 新更新", input: "xuyenquathoikhong,", script: "tag.js"},
        {title: "同人 - 新更新", input: "dongnhan,", script: "tag.js"},
        {title: "玄幻魔法 - 新更新", input: "huyenhuyenmaphap,", script: "tag.js"},

        {title: "新入库", input: "&new", script: "search.js"},
        {title: "新更新", input: "&update", script: "search.js"},
        {title: "本周阅读量", input: "&viewweek", script: "search.js"},
        {title: "今日阅读量", input: "&viewday", script: "search.js"},
        {title: "总阅读量", input: "&view", script: "search.js"},
        {title: "点赞数", input: "&like", script: "search.js"},
        {title: "关注数", input: "&following", script: "search.js"},
        {title: "收藏数", input: "&bookmarked", script: "search.js"},

        {title: "不限人气", input: "/ajax_novels/monthvisit_0_0_{0}.htm", script: "gen.js"},
        {title: "连载人气", input: "/ajax_novels/monthvisit_0_2_{0}.htm", script: "gen.js"},
        {title: "全本人气", input: "/ajax_novels/monthvisit_0_1_{0}.htm", script: "gen.js"},

        {title: "不限推荐", input: "/ajax_novels/allvote_0_0_{0}.htm", script: "gen.js"},
        {title: "连载推荐", input: "/ajax_novels/allvote_0_2_{0}.htm", script: "gen.js"},
        {title: "全本推荐", input: "/ajax_novels/allvote_0_1_{0}.htm", script: "gen.js"},

        {title: "全部分类", input: "/ajax_novels/full/0/{0}.htm", script: "gen.js"},
        {title: "言情小说", input: "/ajax_novels/full/3/{0}.htm", script: "gen.js"},
        {title: "玄幻魔法", input: "/ajax_novels/full/1/{0}.htm", script: "gen.js"},
        {title: "修真武侠", input: "/ajax_novels/full/2/{0}.htm", script: "gen.js"},
        {title: "穿越时空", input: "/ajax_novels/full/11/{0}.htm", script: "gen.js"},
        {title: "都市小说", input: "/ajax_novels/full/9/{0}.htm", script: "gen.js"},
        {title: "历史军事", input: "/ajax_novels/full/4/{0}.htm", script: "gen.js"},
        {title: "游戏竞技", input: "/ajax_novels/full/5/{0}.htm", script: "gen.js"},
        {title: "科幻空间", input: "/ajax_novels/full/6/{0}.htm", script: "gen.js"},
        {title: "悬疑惊悚", input: "/ajax_novels/full/7/{0}.htm", script: "gen.js"},
        {title: "同人小说", input: "/ajax_novels/full/8/{0}.htm", script: "gen.js"},
        {title: "官场职场", input: "/ajax_novels/full/10/{0}.htm", script: "gen.js"},
        {title: "青春校园", input: "/ajax_novels/full/12/{0}.htm", script: "gen.js"},
    ]);
}