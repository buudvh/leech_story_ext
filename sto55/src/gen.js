load('libs.js');
load('config.js');

function execute(url, page) {
    url = String.format(BASE_URL + url, page || '1');

    let response = fetch(url);
    if (!response.ok) return null;

    let doc = response.html();

    let data = [];

    let elems = $.QA(doc, 'div.bookinfo');;
    if (!elems.length) return Response.error(url);

    elems.forEach(function(e) {
        data.push({
            name: e.select('h4.bookname').first().text(),
            url: e.select('h4.bookname a').first().attr('href'),
            cover: DEFAULT_COVER,
            description: $.QA(e, 'div', { m: x => x.text(), j: '<br>' }),
        })
    })

    let next = parseInt(page, 10) + 1;

    return Response.success(data, next.toString());
}