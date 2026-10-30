function execute(url) {
    try {
        url = url.replace(ORIGINAL_HOST, REPLACE_HOST);
        let response = fetch(url);

        if (!response.ok) throw new Error(`Status = ${response.status}`);

        // Mục lục nằm ngay trên trang truyện (div.list), không còn ở trang đọc chương.
        let doc = response.html();
        let el = doc.select(".main_content .list li a");
        if (!el.size()) el = doc.select(".list li a");
        if (!el.size()) throw new Error("Length = 0");
        const data = [];
        for (let i = 0; i < el.size(); i++) {
            var e = el.get(i);
            data.push({
                name: e.select("a").text().replace(/第(\d+)节/g, '第$1章'),
                url: e.attr("href"),
                host: BASE_URL
            })
        }

        return Response.success(data);
    } catch (error) {
        return Response.error(`Url: ${url}\nMessage: ${error.message}`);
    }
}