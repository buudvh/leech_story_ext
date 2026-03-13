function execute(url) {
    try {
        url = url.replace(ORIGINAL_HOST, REPLACE_HOST);
        let response = fetch(url);
        if (!response.ok) throw new Error(`Status = ${response.status}`);
        let doc = response.html('gbk');
        return Response.success({
            name: doc.select(".nav_name h1").text(),
            author: doc.select(".nav_autor").first().text().replace(/作\s*者：/g, ""),
            description: doc.select(".main_content .desc").html(),
            detail: doc.select(".nav_time").text(),
            cover: DEFAULT_COVER,
            host: "http://www.txt520.com"
        });
    } catch (error) {
        return Response.error(`Url: ${url}\nMessage: ${error.message}`);
    }
}