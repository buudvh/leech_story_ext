function execute(url) {
    try {
        url = url.replace(ORIGINAL_HOST, REPLACE_HOST);
        let response = fetch(url);

        if (!response.ok) throw new Error(`Status = ${response.status}`);

        let doc = response.html();
        let chapter_link = BASE_URL + doc.select(".readnow").attr("href");
        let response_chapter = fetch(chapter_link);

        if (!response_chapter.ok) throw new Error(`Status = ${response.status}`);

        let doc_ch = response_chapter.html();
        let el1 = doc_ch.select(".list").last();
        let el = el1.select("li a")
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