load('libs.js');
load('config.js');

function execute(url) {
    try {
        let response = fetch(url);
        if (response.ok) {
            let doc = response.html();

            return Response.success({
                name: TongWen.toSimplified(doc.select("h1").text()),
                cover: doc.select("img.object-cover").attr("src") || "https://static.sangtacvietcdn.xyz/img/bookcover256.jpg",
                author: '',
                description: doc.select('#book-description').text(),
                detail: $.QA(doc, 'p.text-base', { m: x => x.text(), j: '<br>' }),
                host: BASE_URL
            })
        }

        return Response.error("Status: " + response.status + " " + url);
    } catch (error) {
        return Response.error(error.message);
    }

}