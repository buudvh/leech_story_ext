load("config.js");

function execute() {
	return Response.success([
		{ title: "Update", input: "&sort=update", script: "gen.js" },
        {"title": "Đồng Nhân", "input": "&tag=dongnhan", "script": "tag.js"},
		{ title: "Chư thiên", input: "chư thiên", script: "search.js" },
        {"title": "Chư Thiên Vạn Giới", "input": "&tag=chuthienvangioi", "script": "tag.js"},
        {"title": "Chat Group", "input": "&tag=chatgroup", "script": "tag.js"},
        {"title": "Vô Hạn Lưu", "input": "&tag=vohanluu", "script": "tag.js"},
        {"title": "Diễn Sinh Đồng Nhân", "input": "&tag=diensinhdongnhan", "script": "tag.js"},
        { title: "View Week", input: "&sort=viewweek", script: "gen.js" },
        { title: "View Day", input: "&sort=viewday", script: "gen.js" },
        { title: "View", input: "&sort=view", script: "gen.js" },
		{ title: "New", input: "&sort=new", script: "gen.js" },
        { title: "Like", input: "&sort=like", script: "gen.js" },
        { title: "Follow", input: "&sort=following", script: "gen.js" },
        { title: "Bookmark", input: "&sort=bookmarked", script: "gen.js" },

	]);
}
