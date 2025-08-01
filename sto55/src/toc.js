load('libs.js');
load('config.js');

function execute(url) {
    const bookid = getBookId(url);
    url = BASE_URL + `/book/${bookid}/ajax_index.html`

    let response = fetch(url);
    if (!response.ok) return null;

    let doc = response.html();

    let data = [];
    let elems = doc.select('a');

    elems.forEach(function(e){
        data.push({
            name: e.text(),
            url: e.attr('href'),
            host: "",
        })
    });

    return Response.success(data);
}