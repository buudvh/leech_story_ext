load('libs.js');
load('config.js');

// input: "second_channel=<kênh>&status=<0 tất cả|1 完结|2 连载>&rank=<rỗng 推荐|1 人气|2 热搜|3 飙升|5 评分>"
function execute(input, page) {
    var url = API_URL + '/fiction/search/channel';
    try {
        page = page || '0';
        var list = miduApi('/fiction/search/channel', input + '&page=' + page) || [];

        var data = [];
        list.forEach(function (e) {
            if (!e || !e.book_id) return;
            var orn = e.ornaments || {};
            // leftTags: " 作者 · 完结 · 106万字"; bottom: "8703人气值" / "9.2分"...
            var info = cleanText(orn.leftTags && orn.leftTags.length ? orn.leftTags[0].text : '');
            var stat = cleanText(orn.bottom && orn.bottom.text);
            data.push({
                name: cleanText(e.title),
                link: miduBookUrl(e.book_id),
                cover: miduCover(e),
                description: [info, stat].filter(function (x) { return x; }).join(' · ')
                    + (e.description ? '\n' + cleanText(e.description) : ''),
                host: BASE_URL
            });
        });

        if (!data.length) {
            if (page != '0') return Response.success([], '');
            throw new Error('Length = 0');
        }

        // Trang giữa có thể ít hơn 10 mục; chỉ trang rỗng mới là hết.
        return Response.success(data, (parseInt(page, 10) + 1).toString());
    } catch (error) {
        return Response.error(`fetch ${url} failed: ${error.message}`);
    }
}
