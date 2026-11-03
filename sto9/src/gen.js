load('libs.js');
load('config.js');

// Danh sách truyện: tab 最近更新 ("update"), tab phân loại ("class:<mã>", theo bộ lọc) và URL kiểu cũ.
function execute(input, page) {
    var url;
    try {
        page = page || '1';
        url = listUrl(String(input || ''), page);
        var response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`)

        var doc = response.html();
        var elms = doc.select("#article_list_content > li");

        var data = [];
        elms.forEach(function (e) {
            // Quá trang cuối trang vẫn trả một <li> trống ⇒ chỉ tính mục có link.
            if (!e.select("div.newnav > h3 > a").first().attr("href")) return;
            data.push({
                name: e.select("div.newnav > h3 > a").first().text().convertT2S() || e.select("div.newnav > h3 > a:nth-child(2)").first().text().convertT2S(),
                link: e.select("div.newnav > h3 > a").first().attr("href"),
                cover: e.select("a > img").first().attr("data-src") || DEFAULT_COVER,
                description: e.select("div.newnav > div.labelbox > label:nth-child(1) > a").first().text().convertT2S()
                    + "\n" + e.select("div.newnav > ol").first().text().convertT2S(),
                host: BASE_URL
            });
        });

        // Hết trang ⇒ danh sách rỗng, không báo lỗi (app hiện "Đã hết").
        return Response.success(data, nextPageOf(doc, page, data.length));
    } catch (error) {
        return Response.error(`Url ${url} \nMessage: ${error.message}`);
    }
}
