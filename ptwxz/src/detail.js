load('libs.js');
load('config.js');


function execute(url) {
    try {
        let response = fetch(url);

        if (!response.ok) throw new Error("Status" + response.status);

        let doc = response.html('gb2312');
        let author = $.QA(doc, '#content table table td', { f: x => /作.*者：/.test(x.text()), m: x => x.text().replace(/作.*者：/, '').replace('<br', '').trim(), j: ' ' });
        let category = extractCategory(doc.select('#content > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td:nth-child(1)').text());
        let cover = doc.select('#content table table a > img[align][hspace][vspace]').first().attr('src');
        let description = $.Q(doc, '#content table table div[style]:not([id]):not([onclick])', { remove: 'span, a' }).html();
        var detail = $.QA(doc, '#content > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td',
            {
                m: function (x) { return x.text().indexOf("最后更新：") == 0 ? x.text() : ""; }
                , j: '<br>'
            });
        description = cleanHtml(description);

        var categories = {
            '玄幻魔法': '/booksort1/0/{0}.html',
            '武侠修真': '/booksort2/0/{0}.html',
            '都市言情': '/booksort3/0/{0}.html',
            '历史军事': '/booksort4/0/{0}.html',
            '网游竞技': '/booksort5/0/{0}.html',
            '科幻小说': '/booksort6/0/{0}.html',
            '恐怖灵异': '/booksort7/0/{0}.html',
            '同人漫画': '/booksort8/0/{0}.html',
            '其他类型': '/booksort9/0/{0}.html',
        };

        var bookName = $.Q(doc, '#content h1').text();

        var bookSameAuthor = getListBookSameAuhtor(doc);

        return Response.success({
            name: bookName,
            cover: cover,
            author: author,
            description: description,
            detail: detail,
            host: BASE_URL,
            genres: [
                {
                    title: category,
                    input: categories[category],
                    script: "gen.js"
                }
            ],
            comments: [
                {
                    title: "QQ Comments",
                    input: bookName,
                    script: "qqcomment.js"
                },
            ],
            suggests: [
                {
                    title: "同作者",
                    input: JSON.stringify(bookSameAuthor),
                    script: "author.js"
                },
            ],
        });
    } catch (error) {
        return Response.error("Url: " + url + "\nMessage: " + error.message);
    }
}

function getListBookSameAuhtor(doc) {
    var elms = doc.select(".sidebar-item");
    if (!elms.length) return [];

    var data = [];
    elms.forEach(element => {
        data.push({
            name: element.select(".info a").first().text(),
            link: element.select(".info a").first().attr("href"),
            cover: element.select(".imgbox img").first().attr("src") || DEFAULT_COVER,
            description: element.select(".info dd").first().text(),
            host: BASE_URL
        })
    });

    return data;
}

function extractCategory(strText) {
    if (!strText || typeof strText !== 'string') { return ''; }

    // 1) chuẩn hóa khoảng trắng (nhiều khoảng trắng -> 1) và trim
    var s = strText.replace(/\s+/g, ' ').trim();

    // 2) regex tìm "类 别" / "类别" / "类目" + dấu hai chấm (半角 hoặc 全角) + phần còn lại
    var re = /(?:类\s*别|类别|类目)\s*[:：]\s*(.+)$/;
    var m = s.match(re);
    if (m && m[1]) {
        return m[1].trim();
    }

    // 3) fallback: nếu có dấu hai chấm, lấy phần sau dấu hai chấm cuối cùng
    var idx = Math.max(s.lastIndexOf(':'), s.lastIndexOf('：'));
    if (idx !== -1 && idx + 1 < s.length) {
        return s.slice(idx + 1).trim();
    }

    // 4) không tìm thấy -> trả về rỗng
    return '';
}