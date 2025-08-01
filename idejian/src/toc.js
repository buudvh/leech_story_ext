load('config.js');
function execute(url) {
    let page = 1;
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    const match = url.match(/book\/(\d+)/);
    const bookId = match ? match[1] : null;
    let data = [];
    const chapterRegex = /<a href="([^"]+)">([^<]+)<\/a>/g;
    
    while(true){
        url = BASE_URL + 'catelog/' + bookId + '/1/?page=' + page;
        let response = fetch(url);
        if (response.ok) {
            let json = response.json();
            let html = json.html;
            if (html.length == 0) {
                break;
            }
            page++;
            // html = Html.parse(html);
            // let el = html.select("li a");
            // for (let i = 0; i < el.size(); i++) {
            //     var e = el.get(i);
            //     data.push({
            //         name: e.text(),
            //         url: BASE_URL + e.attr("href"),
            //         host: BASE_URL
            //     });
    
            // }         
            let match;
            while ((match = chapterRegex.exec(html)) !== null) {
                data.push({
                    url: match[1],
                    name: match[2].trim(),
                    host: BASE_URL
                });
            }
        }
    }
    

    return Response.success(data);
}