load("config.js");
load("libs.js");

// function execute(key, page) {
// 	var url = '';
// 	try {
// 		url = `${BASE_URL}/api/author/search/search_book/v0`;
// 		page = page || '0';

// 		const data = fetch(url, {
// 			queries: {
// 				filter: "127,127,127,127",
// 				page_count: "10",
// 				page_index: page,
// 				query_word: key,
// 			},
// 		}).json();

// 		page = parseInt(page);

// 		const next = data.data.total_count > (page + 1) * 10 ? page + 1 : null;

// 		const list = data.data.search_book_data_list.map((book) => {
// 			return {
// 				name: GetDecode(book.book_name),
// 				link: `${BASE_URL}/page/${book.book_id}`,
// 				host: BASE_URL,
// 				cover: book.thumb_url,
// 				description: GetDecode(book.author),
// 			};
// 		});
// 		return Response.success(list, next.toString());
// 	} catch (error) {
// 		return Response.error(`Url: ${url} \nMessage: ${error.message}`);
// 	}
// }

function execute(key, page) {
	var url = "";
	try {
        page = page || '1';
        var ignoresConfig = localStorage.getItem("IGNORES") || "";

        url = `${STV_HOST}/io/searchtp/searchBooks?findinname=${encodeURIComponent(key)}&host=fanqie&minc=0&tag=&sort=update&p=${page}`;
        var response = fetch(url, {
            "body": `ignores=${encodeURIComponent(IGNORES + ignoresConfig)}`,
            "method": "POST",
        });
        if (!response.ok) throw new Error(`Status = ${response.status}`);

        var doc = response.html();
        var next = (parseInt(page, 10) + 1).toString();
        var elms = doc.select("a.booksearch");

        if (!elms.length) throw new Error("Length = 0");

        var data = [];
        elms.forEach(e => {
            var bookid = e.select("a").first().attr("href").split("/")[4];
            var tag = e.select("div > span.searchtag").first().text().trim();

            if (tag != "fanqie") return;

            data.push({
                name: toCapitalize(e.select(".searchbooktitle").first().text()),
                link: `${BASE_URL}/page/${bookid}`,
                cover: e.select("img").first().attr("src"),
                description: e.select("div > span.searchtag").first().text() + "|" + e.select("div > span.searchbookauthor").first().text()
                    + "\n" + e.select("div > span.lhr").last().text(),
            });
        });

        return Response.success(data, next);
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}