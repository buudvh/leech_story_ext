load('libs.js');
load('config.js');

function execute(url) {
    try {
        let response = fetch(url);
        
        if (!response.ok) throw new Error(`Status = ${response.status}`);

        let doc = response.html('gbk');
        var data = [];
        var elems = doc.select("div.newbox li")
        if (!elems.length) throw new Error("Length = 0");
        
        elems.forEach(function (e) {
            var bookid = extractBookId(e.select("h3 a").attr('href'), false);
            data.push({
                name: e.select("h3").text().trim(),
                link: STVHOST + "/truyen/69shu/1/" + bookid + "/",
                cover: e.select("img").attr("data-src") || DEFAULT_COVER,
                description: $.Q(e, '.zxzj > p').text().replace('最近章节', ''),
            })
        })
        return Response.success(data);
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}