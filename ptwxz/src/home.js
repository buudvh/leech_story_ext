function execute() {
    return Response.success([
        { title: "Update", input: "&update", script: "search.js" },
        { title: "Chư thiên lưu", input: "chư thiên&update", script: "search.js" },
        { title: "Đồng nhân 1", input: "dongnhanmanga,", script: "tag.js" },
        { title: "Đồng nhân 2", input: "cungnguoimanga,", script: "tag.js" },
        { title: "View Week", input: "&viewweek", script: "search.js" },
        { title: "View Day", input: "&viewday", script: "search.js" },
        { title: "View", input: "&view", script: "search.js" },
        { title: "New", input: "&new", script: "search.js" },
        { title: "Like", input: "&like", script: "search.js" },
        { title: "Follow", input: "&following", script: "search.js" },
        { title: "Bookmark", input: "&bookmarked", script: "search.js" },
        { title: "Huyền huyễn", input: "huyenhuyenmaphap,", script: "tag.js" },
        { title: "Võ hiệp", input: "vohieptuchan,", script: "tag.js" },
        { title: "Lịch sử", input: "lichsuquansu,", script: "tag.js" },
        { title: "Khoa huyễn", input: "khoahuyen,", script: "tag.js" },
    ]);
}