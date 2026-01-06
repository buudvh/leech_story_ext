load("config.js");

function execute(url, page) {
	try {
		const response = fetch(url, {
			queries: {
				limit: 200,
				offset: 0,
			},
		});

		if (!response.ok) throw new Error(`Status = ${response.status}`);

		const data = response.json();

		return Response.success(
			data.book_list.map((book) => {
				return {
					name: book.book_name,
					link: `${BASE_URL}/page/${book.book_id}`,
					cover: book.thumb_url,
				};
			}),
			null,
		);
	} catch (error) {
		return Response.error(`Url: ${url} \nMessage: ${error.message}`);
	}
}
