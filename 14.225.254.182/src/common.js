var STV_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

function stvBase() {
    var base = (typeof BASE_URL !== 'undefined' && BASE_URL) ? String(BASE_URL) : "http://14.225.254.182";
    return base.replace(/\/+$/, "");
}

function stvAbsolute(link) {
    link = (link || "").trim();
    if (!link) return "";
    if (link.indexOf("//") === 0) return "https:" + link;
    if (link.indexOf("http://") === 0 || link.indexOf("https://") === 0) return link;
    return stvBase() + (link.charAt(0) === "/" ? link : "/" + link);
}

// Danh sách truyện của /io/searchtp/searchBooks (Home, thể loại, tìm kiếm, cùng tác giả)
function stvParseBooks(doc) {
    var links = doc.select("a.booksearch");
    if (links.size() === 0) {
        links = doc.select("a.cap");
    }

    var results = [];
    var seen = {};
    for (var i = 0; i < links.size(); i++) {
        var item = links.get(i);
        var href = item.attr("href");
        if (!href || !/\/truyen\/[^\/]+\/1\/[^\/]+/.test(href)) continue;

        var link = stvAbsolute(href);
        if (seen[link]) continue;
        seen[link] = true;

        var name = item.select(".searchbooktitle").text().trim();
        if (!name) name = item.select("b").text().trim();
        if (!name) name = item.text().trim();

        // searchtag thứ nhất là nguồn (qidian…), thứ hai là trạng thái (Còn Tiếp / Hoàn Thành)
        var tags = item.select("span.searchtag");
        var sourceHost = tags.size() > 0 ? tags.get(0).text().trim() : "";
        var status = tags.size() > 1 ? tags.get(1).text().trim() : "";
        var summary = item.select("span[style*=font-size]").text().trim();

        results.push({
            name: name,
            author: item.select(".searchbookauthor").text().trim() || "Không rõ",
            description: (sourceHost ? "[" + sourceHost + "] " : "") + summary,
            tag: status,
            cover: stvAbsolute(item.select("img").attr("src")),
            link: link,
            host: stvBase()
        });
    }
    return results;
}

function tag(title, host, sort, tag) {
    var input = stvBase() + "/io/searchtp/searchBooks?find=&host=" + host + "&minc=0&sort=" + sort + "&tag=" + tag + "&p={0}";
    return { title: title, input: input, script: "homecontent.js" };
}
