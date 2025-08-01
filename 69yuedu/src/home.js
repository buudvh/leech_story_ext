function execute() {
    return Response.success([
        { title: "诸天流", input: "/诸天流/{0}/", script: "gen2.js" },
        { title: "无限流", input: "/无限流/{0}/", script: "gen2.js" },

        {title: "不限新书榜", input: "/ajax_novels/newhot_0_0_{0}.htm", script: "gen.js"},
        {title: "连载新书榜", input: "/ajax_novels/newhot_0_2_{0}.htm", script: "gen.js"},
        {title: "全本新书榜", input: "/ajax_novels/newhot_0_1_{0}.htm", script: "gen.js"},

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