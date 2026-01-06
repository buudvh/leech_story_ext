load("config.js");

function execute() {
	return Response.success([
		{
			title: "TOP bảng xếp hạng",
			input: `${BASE_URL}/api/author/misc/top_book_list/v1/`,
			script: "homecontent.js",
		},
		{title: "最新", input: "/api/author/library/book_list/v/?gender=1&category_id=704&creation_status=-1&word_count=-1&sort=1", script: "genrecontent.js"},
		{title: "最热", input: "/api/author/library/book_list/v/?gender=1&category_id=704&creation_status=-1&word_count=-1&sort=0", script: "genrecontent.js"},
		{title: "最热-已完结", input: "/api/author/library/book_list/v/?gender=1&category_id=704&creation_status=0&word_count=-1&sort=0", script: "genrecontent.js"},
		{title: "最热-连载中", input: "/api/author/library/book_list/v/?gender=1&category_id=704&creation_status=1&word_count=-1&sort=0", script: "genrecontent.js"},
		{title: "最新-已完结", input: "/api/author/library/book_list/v/?gender=1&category_id=704&creation_status=0&word_count=-1&sort=1", script: "genrecontent.js"},
		{title: "最新-连载中", input: "/api/author/library/book_list/v/?gender=1&category_id=704&creation_status=1&word_count=-1&sort=1", script: "genrecontent.js"},
		{title: "字数-已完结", input: "/api/author/library/book_list/v/?gender=1&category_id=704&creation_status=0&word_count=-1&sort=2", script: "genrecontent.js"},
		{title: "字数-连载中", input: "/api/author/library/book_list/v/?gender=1&category_id=704&creation_status=1&word_count=-1&sort=2", script: "genrecontent.js"},
	]);
}
