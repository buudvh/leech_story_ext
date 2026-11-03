load('libs.js');
load('common.js');

// input: "cat:<mã thể loại>" | "tag:<slug>" | kiểu cũ "slug,&update".
function execute(tag, page) {
    var url = '';
    try {
        if (!page) page = '1';
        var input = String(tag || '');
        var category = '';
        var slug = '';
        if (input.indexOf('cat:') === 0) {
            category = input.substring(4).trim();
        } else if (input.indexOf('tag:') === 0) {
            slug = input.substring(4).trim();
        } else {
            // Kiểu cũ: phần sau "&" là sắp xếp, nay lấy từ cấu hình.
            slug = input.split('&')[0].trim().replace(/,+$/, '');
        }
        var tagPart = slug ? slug + ',' : '';

        url = STVHOST + '/io/searchtp/searchBooks/?find=&host=qidian' + (category ? '&category=' + category : '') +
            buildFilterQuery() + '&tag=' + tagPart + '&p=' + page;
        let response = fetch(url);

        if (response.ok) {
            let doc = response.html()
            let next = parseInt(page, 10) + 1;
            let el = doc.select("a.booksearch")
            if (!el.length) return Response.success([], null);
            let data = [];
            el.forEach(e => {
                let stv_story_link = e.select("a").first().attr("href");
                let bookid = stv_story_link.split("/")[4];
                data.push({
                    name: toCapitalize(e.select(".searchbooktitle").first().text()),
                    link: STVHOST + "/truyen/qidian/1/" + bookid + "/",
                    cover: e.select("img").attr("src") || DEFAULT_COVER,
                    description: e.select("div > span.searchtag").first().text() + "|" + e.select("div > span.searchbookauthor").first().text()
                        + "\n" + e.select("div > span.lhr").last().text(),
                })
            });

            return Response.success(data, next.toString());
        }

        return Response.error('fetch ' + url + ' failed: status ' + response.status);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}
