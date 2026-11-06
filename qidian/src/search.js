load('libs.js');
load('common.js');
load('filter.js');
load('filter_sort.js');

function execute(key, page) {
    // Sắp xếp/số chương/loại/trạng thái lấy từ cấu hình; bỏ phần sau "&" của từ khoá.
    var keyword = String(key || '').split("&")[0];
    if (!page) page = '1';

    var url = STVHOST + '/io/searchtp/searchBooks/?findinname=' + encodeURIComponent(keyword) +
        '&host=qidian' + buildFilterQuery() + '&tag=&p=' + page;

    if (keyword.indexOf("find=") === 0) {
        url = STVHOST + '/io/searchtp/searchBooks/?find=' + encodeURIComponent(keyword.replace("find=", "")) +
            '&host=qidian' + buildFilterQuery() + '&tag=&p=' + page;
    }
    var response = fetch(url);

    if (!response.ok) return Response.error('fetch ' + url + ' failed: status ' + response.status);

    var doc = response.html();
    var next = (parseInt(page, 10) + 1).toString();
    var el = doc.select("a.booksearch");

    if (!el.length) return null;

    var data = [];
    el.forEach(function (e) {
        var stv_story_link = e.select("a").first().attr("href");
        var bookid = stv_story_link.split("/")[4];
        data.push({
            name: toCapitalize(e.select(".searchbooktitle").first().text()),
            link: STVHOST + "/truyen/qidian/1/" + bookid + "/",
            cover: e.select("img").attr("src") || DEFAULT_COVER,
            description: e.select("div > span.searchtag").first().text() + "|" + e.select("div > span.searchbookauthor").first().text()
                + "\n" + e.select("div > span.lhr").last().text(),
            source: e.select("div > span.searchtag").first().text().trim(),
        });
    });

    data = data.filter(p => p.source == "qidian");

    return Response.success(data, next);
}
