load('libs.js');
load('config.js');

function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html('gbk');

        return Response.success({
            name: $.Q(doc, 'h1').text(),
            cover: doc.select("img.object-cover").attr("src") || "https://static.sangtacvietcdn.xyz/img/bookcover256.jpg",
            author: '',
            description: '',
            detail: '',
            host: BASE_URL
        })
    }
    return null;
}