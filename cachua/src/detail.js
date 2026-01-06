load("config.js");

function execute(url) {
	try {
		const response = fetch(url);
		if (!response.ok) throw new Error(`Status = ${response.status}`);
		const htmlText = response.text();

		const regex = /window\.__INITIAL_STATE__\s*=\s*({.*});/;
		const match = htmlText.match(regex);
		const data = JSON.parse(match[1]);
		const categoryV2 = data.page.categoryV2 != "" ? JSON.parse(data.page.categoryV2) : [];
		const category = data.page.category != "" ? JSON.parse(data.page.category) : [];
		const categoryAll = categoryV2.concat(category);
		var genres = [];
		categoryAll.forEach(e => {
			genres.push({
				title: e.Name,
				input: `/api/author/library/book_list/v0/?category_id=${e.ObjectId}`,
				script: "genrecontent.js"
			});
		});

		return Response.success({
			name: data.page.bookName,
			cover: data.page.thumbUrl,
			host: BASE_URL,
			author: data.page.author,
			description: data.page.abstract,
			ongoing: data.page.status === 1,
			suggests: [
				{
					title: "同作者",
					input: data.page.author,
					script: "search.js"
				},
			],
			genres: genres,
		});
	} catch (error) {
		return Response.error(`Url: ${url} \nMessage: ${error.message}`);
	}
}
