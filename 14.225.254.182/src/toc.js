function execute(url) {
    var baseUrl = (typeof BASE_URL !== 'undefined') ? BASE_URL : "http://14.225.254.182";
    
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
    
    var ajaxUrl = baseUrl + "/index.php?ngmar=chapterlist&h=" + sourceHost + "&bookid=" + bookId + "&sajax=getchapterlist";
    
    var response = Http.get(ajaxUrl)
        .header("Referer", url)
        .header("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1")
        .string();
        
    var json = JSON.parse(response);
    // Allow both string '1' and integer 1
    if (json.code != 1 || !json.oridata) {
        return Response.error("Tải danh sách mục lục thất bại");
    }
    
    var chapters = [];
    var rawChapters = [];

    if(json.data){
        rawChapters = json.data.split("-//-");
    }

    if(json.oridata){
        rawChapters = json.oridata.split("-//-");
    }
    
    for (var i = 0; i < rawChapters.length; i++) {
        var part = rawChapters[i].split("-/-");
        if (part.length < 3) continue;
        
        var volId = part[0];
        var chapId = part[1];
        var title = part[2];
        
        var chapUrl = baseUrl + "/truyen/" + sourceHost + "/" + volId + "/" + bookId + "/" + chapId + "/";
        
        chapters.push({
            name: title,
            url: chapUrl,
            host: baseUrl
        });
    }
    
    return Response.success(chapters);
}
