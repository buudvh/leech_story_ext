load('libs.js');
function execute(url, page) {
    try {
        if (!page) page = '1';
        let inputUrl = String.format(url.replace('https','http'), page);
        let response = fetch(inputUrl);
        if (response.ok) {
            let doc = response.html();
            var data = [];
            var elems = doc.select('div.bookbox');
            elems.forEach(function (e) {
                data.push({
                    name: e.select("h4.bookname").text(),
                    link: e.select("h4.bookname a").first().attr('href'),
                    cover: "",
                    description: "",
                    author: "",
                    kind: ""
                })
            })
            let next_page = parseInt(page) + 1;
            return Response.success(data, next_page.toString());
        }
        return null;
    } catch (error) {
        return Response.success([{
            name: "BUU",
            link: "BUU",
            cover: "https://cdn.qidian-vp.com/poster/cau-tha-thanh-thanh-nhan-tien-quan-trieu-ta-cham-ngua-150.jpg",
            description: error.message,
            author: "",
            kind: ""
        }], 0);
    }

}