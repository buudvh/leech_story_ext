function execute() {
    return Response.success([
        { title: "人气", input: "/ajax_topindex/{0}", script: "gen.js" },

        { title: "诸天流", input: "/诸天流/{0}/", script: "gen2.js" },

        { title: "不限人气", input: "/ajax_articlelist/weekvisit_0_0_{0}.htm", script: "gen.js" },
        { title: "连载人气", input: "/ajax_articlelist/weekvisit_0_2_{0}.htm", script: "gen.js" },
        { title: "全本人气", input: "/ajax_articlelist/weekvisit_0_1_{0}.htm", script: "gen.js" },

        { title: "不限推荐", input: "/ajax_articlelist/allvote_0_0_{0}.htm", script: "gen.js" },
        { title: "连载推荐", input: "/ajax_articlelist/allvote_0_2_{0}.htm", script: "gen.js" },
        { title: "全本推荐", input: "/ajax_articlelist/allvote_0_1_{0}.htm", script: "gen.js" },

        { title: "不限新书", input: "/ajax_articlelist/newhot_0_0_{0}.htm", script: "gen.js" },
        { title: "连载新书", input: "/ajax_articlelist/newhot_0_2_{0}.htm", script: "gen.js" },
        { title: "全本新书", input: "/ajax_articlelist/newhot_0_1_{0}.htm", script: "gen.js" },

        { title: "全部分类", input: "/ajax_articlelist/class/0/{0}.htm", script: "gen.js" },
        { title: "言情小说", input: "/ajax_articlelist/class/3/{0}.htm", script: "gen.js" },
        { title: "玄幻魔法", input: "/ajax_articlelist/class/1/{0}.htm", script: "gen.js" },
        { title: "修真武侠", input: "/ajax_articlelist/class/2/{0}.htm", script: "gen.js" },
        { title: "穿越时空", input: "/ajax_articlelist/class/11/{0}.htm", script: "gen.js" },
        { title: "都市小说", input: "/ajax_articlelist/class/9/{0}.htm", script: "gen.js" },
        { title: "历史军事", input: "/ajax_articlelist/class/4/{0}.htm", script: "gen.js" },
        { title: "游戏竞技", input: "/ajax_articlelist/class/5/{0}.htm", script: "gen.js" },
        { title: "科幻空间", input: "/ajax_articlelist/class/6/{0}.htm", script: "gen.js" },
        { title: "悬疑惊悚", input: "/ajax_articlelist/class/7/{0}.htm", script: "gen.js" },
        { title: "同人小说", input: "/ajax_articlelist/class/8/{0}.htm", script: "gen.js" },
        { title: "官场职场", input: "/ajax_articlelist/class/10/{0}.htm", script: "gen.js" },
    ]);
}