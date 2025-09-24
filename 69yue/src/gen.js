load('libs.js');
load('config.js');

//热门书单

function execute(url, page) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html('gbk');
        var data = [];
        var elems = $.QA(doc, 'section.mb-12 > div.space-y-4 > div');
        if (!elems.length) return Response.error(url);
        elems.forEach(function(e) {
            data.push({
                name: $.Q(e, 'h3').text().trim(),
                link: $.Q(e, 'h3 > a').attr('href'),
                cover: "https://static.sangtacvietcdn.xyz/img/bookcover256.jpg",
                description: $.QA(doc, 'div:nth-child(2) > div:nth-child(2) > p', { m: x => x.text(), j: '<br>' }) + '<br>' + doc.select('.booktime').text(),
                host: BASE_URL
            })
        })
        var next = parseInt(page, 10) + 1;
        return Response.success(data, next.toString());
    }
    return null;
}