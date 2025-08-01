load('libs.js');
load('config.js');


function execute(url) {
    let response = fetch(url);
    if (!response.ok) return null;

    let doc = response.html();
    let cover = doc.select('div.bookcover img.thumbnail').first().attr('src');

    return Response.success({
        name: doc.select('h1.booktitle').text(),
        cover: cover,
        author: "",
        description: "",
        detail:  $.QA(doc, '.booktag span', { m: x => x.text(), j: '<br>' }) + '<br>' + doc.select('.booktime').text(),
        host: ""
    });
}