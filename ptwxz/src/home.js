function execute() {
    return Response.success([
        { title: "新更新", input: "&update", script: "search.js" },
        { title: "新入库", input: "&new", script: "search.js" },
        { title: "本周阅读量", input: "&viewweek", script: "search.js" },
        { title: "今日阅读量", input: "&viewday", script: "search.js" },
        { title: "总阅读量", input: "&view", script: "search.js" },
        { title: "点赞数", input: "&like", script: "search.js" },
        { title: "关注数", input: "&following", script: "search.js" },
        { title: "收藏数", input: "&bookmarked", script: "search.js" },
        {title: '玄幻魔法', input: '/booksort1/0/{0}.html', script: 'gen.js'},
        {title: '武侠修真', input: '/booksort2/0/{0}.html', script: 'gen.js'},
        {title: '都市言情', input: '/booksort3/0/{0}.html', script: 'gen.js'},
        {title: '历史军事', input: '/booksort4/0/{0}.html', script: 'gen.js'},
        {title: '网游竞技', input: '/booksort5/0/{0}.html', script: 'gen.js'},
        {title: '科幻小说', input: '/booksort6/0/{0}.html', script: 'gen.js'},
        {title: '恐怖灵异', input: '/booksort7/0/{0}.html', script: 'gen.js'},
        {title: '同人漫画', input: '/booksort8/0/{0}.html', script: 'gen.js'},
        {title: '其他类型', input: '/booksort9/0/{0}.html', script: 'gen.js'},
    ]);
}