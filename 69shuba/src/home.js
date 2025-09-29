function execute() {
    return Response.success([

        { title: "官场 - Update", input: "quantruongcholamviec,", script: "tag.js" },
        { title: "Update", input: "&update", script: "search.js" },
        { title: "诸天流 - Update", input: "chư thiên&update", script: "search.js" },
        { title: "诸天流 - 69shu", input: "/诸天流/{0}/", script: "gen2.js" },
        { title: "无限流 - 69shu", input: "/无限流/{0}/", script: "gen2.js" },
        { title: "武侠 - Update", input: "vuhiep,", script: "tag.js" },
        { title: "同人 - Update", input: "dongnhan,", script: "tag.js" },
        { title: "诸天流 - Day", input: "chư thiên&viewday", script: "search.js" },
        { title: "诸天流 - Week", input: "chư thiên&viewweek", script: "search.js" },
        { title: "诸天流 - View", input: "chư thiên&view", script: "search.js" },
        { title: "诸天流 - New", input: "chư thiên&new", script: "search.js" },
        { title: "诸天流 - Like", input: "chư thiên&like", script: "search.js" },
        { title: "诸天流 - Follow", input: "chư thiên&following", script: "search.js" },
        { title: "诸天流 - Bookmark", input: "chư thiên&bookmarked", script: "search.js" },

        { title: "时空 - Update", input: "xuyenquathoikhong,", script: "tag.js" },
        { title: "玄幻魔法 - Update", input: "huyenhuyenmaphap,", script: "tag.js" },

        { title: "New", input: "&new", script: "search.js" },
        { title: "View Week", input: "&viewweek", script: "search.js" },
        { title: "View Day", input: "&viewday", script: "search.js" },
        { title: "View", input: "&view", script: "search.js" },
        { title: "Like", input: "&like", script: "search.js" },
        { title: "Follow", input: "&following", script: "search.js" },
        { title: "Bookmark", input: "&bookmarked", script: "search.js" },

        { title: "不限人气", input: "/ajax_novels/monthvisit_0_0_{0}.htm", script: "gen.js" },
        { title: "连载人气", input: "/ajax_novels/monthvisit_0_2_{0}.htm", script: "gen.js" },
        { title: "全本人气", input: "/ajax_novels/monthvisit_0_1_{0}.htm", script: "gen.js" },

        { title: "不限推荐", input: "/ajax_novels/allvote_0_0_{0}.htm", script: "gen.js" },
        { title: "连载推荐", input: "/ajax_novels/allvote_0_2_{0}.htm", script: "gen.js" },
        { title: "全本推荐", input: "/ajax_novels/allvote_0_1_{0}.htm", script: "gen.js" },

        { title: "全部分类", input: "/ajax_novels/full/0/{0}.htm", script: "gen.js" },
        { title: "言情小说", input: "/ajax_novels/full/3/{0}.htm", script: "gen.js" },
        { title: "玄幻魔法", input: "/ajax_novels/full/1/{0}.htm", script: "gen.js" },
        { title: "修真武侠", input: "/ajax_novels/full/2/{0}.htm", script: "gen.js" },
        { title: "穿越时空", input: "/ajax_novels/full/11/{0}.htm", script: "gen.js" },
        { title: "都市小说", input: "/ajax_novels/full/9/{0}.htm", script: "gen.js" },
        { title: "历史军事", input: "/ajax_novels/full/4/{0}.htm", script: "gen.js" },
        { title: "游戏竞技", input: "/ajax_novels/full/5/{0}.htm", script: "gen.js" },
        { title: "科幻空间", input: "/ajax_novels/full/6/{0}.htm", script: "gen.js" },
        { title: "悬疑惊悚", input: "/ajax_novels/full/7/{0}.htm", script: "gen.js" },
        { title: "同人小说", input: "/ajax_novels/full/8/{0}.htm", script: "gen.js" },
        { title: "官场", input: "/ajax_novels/full/10/{0}.htm", script: "gen.js" },
        { title: "青春校园", input: "/ajax_novels/full/12/{0}.htm", script: "gen.js" },
    ]);
}