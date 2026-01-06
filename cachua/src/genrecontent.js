load("config.js");
load("libs.js");

function execute(url, page) {
	try {
		page = page || '0';

		url = `${BASE_URL}${url}&book_type=-1&page_count=50&page_index=${page}`;
		const response = fetch(url);

		if (!response.ok) throw new Error(`Status = ${response.status}`);

		const data = response.json();

		page = parseInt(page);

		const next = data.data.has_more ? page + 1 : null;

		const list = data.data.book_list.map((book) => {
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
