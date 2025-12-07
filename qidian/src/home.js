function execute() {
    return Response.success([
        { title: "诸天流 - Update", input: "chư thiên&update", script: "search.js" },
        { title: "Update", input: "&update", script: "search.js" },
        { title: "New", input: "&new", script: "search.js" },
        { title: "View Week", input: "&viewweek", script: "search.js" },
        { title: "View Day", input: "&viewday", script: "search.js" },
        { title: "View", input: "&view", script: "search.js" },
        { title: "Like", input: "&like", script: "search.js" },
        { title: "Follow", input: "&following", script: "search.js" },
        { title: "Bookmark", input: "&bookmarked", script: "search.js" },
    ]);
}