function execute(url) {
    var baseUrl = (typeof BASE_URL !== 'undefined') ? BASE_URL : "http://14.225.254.182";
    var response = Http.get(url).html();
    
    // Parse sourceHost and bookId from URL
    var regex = /\/truyen\/([^\/]+)\/1\/([^\/]+)/;
    var match = url.match(regex);
    if (!match) {
        match = url.match(/\/truyen\/([^\/]+)\/[^\/]+\/([^\/]+)/);
    }
    if (!match) {
        return Response.error("URL truyện không hợp lệ hoặc sai định dạng");
    }
    var sourceHost = match[1];
    var bookId = match[2];
    
    var absoluteLink = baseUrl + "/truyen/" + sourceHost + "/1/" + bookId + "/";
    
    // Name fallbacks
    var name = response.select("#book_name2").text().trim();
    if (!name) name = response.select("meta[property='og:novel:book_name']").attr("content").trim();
    if (!name) name = response.select("meta[property='og:title']").attr("content").trim();
    if (!name) name = response.select("title").text().trim();
    
    // Author fallbacks
    var author = response.select("i[onclick*=find]").select("h2").text().trim();
    if (!author) author = response.select("meta[property='og:novel:author']").attr("content").trim();
    if (!author) author = response.select("#oriname").text().trim();
    if (!author) author = "Không rõ";
    
    // Cover fallbacks & absolute conversion
    var cover = response.select("#thumb-prop").attr("src").trim();
    if (!cover) cover = response.select("meta[property='og:image']").attr("content").trim();
    if (cover) {
        if (cover.indexOf("//") === 0) {
            cover = "http:" + cover;
        } else if (cover.indexOf("/") === 0) {
            cover = baseUrl + cover;
        }
    }
    
    // Description fallbacks
    var description = response.select("#book-sumary").text().trim();
    if (!description) description = response.select("meta[property='og:description']").attr("content").trim();
    if (!description) description = response.select("meta[name='description']").attr("content").trim();
    
    var genres = [];
    var infoRows = response.select("div.blk div.blk-body");
    for (var i = 0; i < infoRows.size(); i++) {
        var text = infoRows.get(i).text();
        if (text.indexOf("Thể loại:") >= 0) {
            var gText = text.replace("Thể loại:", "").trim();
            var gParts = gText.split(" ").filter(Boolean);
            for (var j = 0; j < gParts.length; j++) {
                genres.push({
                    title: gParts[j],
                    input: gParts[j]
                });
            }
        }
    }
    
    return Response.success({
        name: name,
        author: author,
        cover: cover,
        description: description,
        detail: description,
        host: baseUrl,
        link: absoluteLink,
        genres: genres,
        suggests: [],
        comments: []
    });
}
