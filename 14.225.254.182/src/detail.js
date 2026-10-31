load('common.js');

function execute(url) {
    var baseUrl = stvBase();

    // Parse sourceHost and bookId from URL
    var match = url.match(/\/truyen\/([^\/]+)\/1\/([^\/?#]+)/);
    if (!match) {
        match = url.match(/\/truyen\/([^\/]+)\/[^\/]+\/([^\/?#]+)/);
    }
    if (!match) {
        return Response.error("URL truyện không hợp lệ hoặc sai định dạng: " + url);
    }
    var sourceHost = match[1];
    var bookId = match[2];
    var absoluteLink = baseUrl + "/truyen/" + sourceHost + "/1/" + bookId + "/";

    var res = fetch(url);
    if (!res.ok) {
        return Response.error("Url: " + url + "\nStatus: " + res.status);
    }
    var response = res.html();

    function meta(property) {
        return response.select("meta[property='" + property + "']").attr("content").trim();
    }

    // Tên gốc tiếng Trung để app tự dịch; tên Việt của STV đưa vào phần thông tin
    var nameVi = response.select("#book_name2").text().trim() || meta("og:novel:book_name");
    var name = response.select("#oriname").text().trim();
    if (!name) name = nameVi;
    if (!name) name = meta("og:title");
    if (!name) {
        return Response.error("Không đọc được tên truyện: " + url);
    }

    // Tác giả gốc nằm trong link tìm theo tác giả
    var authorMatch = response.select("i.cap").attr("onclick").match(/findinname=([^']*)/);
    var author = authorMatch ? authorMatch[1].trim() : "";
    if (!author) author = meta("og:novel:author");

    var cover = stvAbsolute(response.select("#thumb-prop").attr("src"));
    if (!cover) cover = stvAbsolute(meta("og:image"));

    var status = meta("og:novel:status");
    var category = meta("og:novel:category");
    var updateTime = meta("og:novel:update_time");
    var detail = [
        nameVi && nameVi !== name ? "Tên Việt: " + nameVi : "",
        "Nguồn: " + sourceHost,
        status ? "Trạng thái: " + status : "",
        category ? "Thể loại: " + category : "",
        updateTime ? "Cập nhật: " + updateTime : ""
    ].filter(function (line) { return line; }).join("\n");

    var description = response.select("#book-sumary").text().trim();
    if (!description) description = meta("og:description");
    if (!description) description = response.select("meta[name='description']").attr("content").trim();

    var suggests = [];
    var otherSources = [];
    response.select("#chapterlist > div:nth-child(2) > div > div > a").forEach(function (e) {
        otherSources.push({
            name: "(" + e.text() + ")" + name,
            cover: DEFAULT_COVER,
            link: e.attr("href"),
            host: baseUrl
        });
    });
    if (otherSources.length > 0) {
        suggests.push({
            title: "Nguồn khác",
            input: JSON.stringify(otherSources),
            script: "parseJSON.js"
        });
    }
    if (author) {
        suggests.push({
            title: "Cùng tác giả",
            input: baseUrl + "/io/searchtp/searchBooks?find=&findinname=" + encodeURIComponent(author) + "&minc=0&sort=update&tag=&p={0}",
            script: "homecontent.js"
        });
    }

    return Response.success({
        name: name,
        author: author,
        cover: cover,
        description: description,
        detail: detail,
        ongoing: !/hoàn/i.test(status),
        host: baseUrl,
        link: absoluteLink,
        suggests: suggests,
        comments: [
            {
                title: "Bình luận",
                input: JSON.stringify({ bookid: bookId, host: sourceHost }),
                script: "comment.js"
            }
        ]
    });
}
