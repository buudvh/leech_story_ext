function execute() {
    return Response.success([
        { title: "Update", input: "&update", script: "search.js" },
        { title: "Chư Thiên", input: "chuthien,&update", script: "tag.js" },
        { title: "Chư Thiên Lưu", input: "chuthienluu,&update", script: "tag.js" },
        { title: "Vô Hạn", input: "vohan,&update", script: "tag.js" },
        { title: "Vô Hạn Lưu", input: "vohanluu,&update", script: "tag.js" },
        { title: "Chư Thiên Vô Hạn", input: "chuthienvohan,&update", script: "tag.js" },
        { title: "Luân Hồi Giả", input: "luanhoigia,&update", script: "tag.js" },
        { title: "New", input: "&new", script: "search.js" },
        { title: "View Week", input: "&viewweek", script: "search.js" },
        { title: "View Day", input: "&viewday", script: "search.js" },
        { title: "View", input: "&view", script: "search.js" },
        { title: "Like", input: "&like", script: "search.js" },
        { title: "Follow", input: "&following", script: "search.js" },
        { title: "Bookmark", input: "&bookmarked", script: "search.js" },
    ]);
}