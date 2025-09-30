function execute() {
    return Response.success([
        { title: "Update", input: "&update", script: "search.js" },
        { title: "诸天流 - Update", input: "chư thiên&update", script: "search.js" },
        { title: "诸天流 - Day", input: "chư thiên&viewday", script: "search.js" },
        { title: "诸天流 - Week", input: "chư thiên&viewweek", script: "search.js" },
        { title: "诸天流 - View", input: "chư thiên&view", script: "search.js" },
        { title: "诸天流 - New", input: "chư thiên&new", script: "search.js" },
        { title: "诸天流 - Like", input: "chư thiên&like", script: "search.js" },
        { title: "诸天流 - Follow", input: "chư thiên&following", script: "search.js" },
        { title: "诸天流 - Bookmark", input: "chư thiên&bookmarked", script: "search.js" },
        { title: "New", input: "&new", script: "search.js" },
        { title: "View Week", input: "&viewweek", script: "search.js" },
        { title: "View Day", input: "&viewday", script: "search.js" },
        { title: "View", input: "&view", script: "search.js" },
        { title: "Like", input: "&like", script: "search.js" },
        { title: "Follow", input: "&following", script: "search.js" },
        { title: "Bookmark", input: "&bookmarked", script: "search.js" },
        
        { title: "人气热", input: "/bangdan/36014", script: "gen.js" },
        { title: "点击榜", input: "/bangdan/36015", script: "gen.js" },
        { title: "收藏榜", input: "/bangdan/36016", script: "gen.js" },
        { title: "新书潜力", input: "/bangdan/36017", script: "gen.js" },
        { title: "完本榜", input: "/bangdan/36021", script: "gen.js" },
    ]);
}