load("config.js");
load("libs.js");

function execute(key, page) {
	var url = '';
	try {
		url = `${BASE_URL}/api/author/search/search_book/v0`;
		page = page || '0';

		const data = fetch(url, {
			queries: {
				filter: "127,127,127,127",
				page_count: "10",
				page_index: page,
				query_word: key,
			},
		}).json();

		page = parseInt(page);

		const next = data.data.total_count > (page + 1) * 10 ? page + 1 : null;

		const list = data.data.search_book_data_list.map((book) => {
			return {
				name: GetDecode(book.book_name),
				link: `${BASE_URL}/page/${book.book_id}`,
				host: BASE_URL,
				cover: book.thumb_url,
				description: GetDecode(book.author),
			};
		});
		return Response.success(list, next.toString());
	} catch (error) {
		return Response.error(`Url: ${url} \nMessage: ${error.message}`);
	}
}
