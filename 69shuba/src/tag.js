load('libs.js');
load('config.js');
load('common.js');

function execute(tag, page) {
    try {
        let arrTag = tag.split("&");
        if (!page) page = '1';
        let sort = 'update';
        if (arrTag.length == 2) {
            sort = arrTag[1];
        }
        // let url = `${STVHOST}/io/searchtp/searchBooks/?find=&tag=${arrTag[0]}&sort=${sort}&host=69shu&minc=0&p=${page}`;
        var url = STVHOST + '/io/searchtp/searchBooks/?find=&tag=' + arrTag[0] + '&sort=' + sort + '&host=69shu&minc=0&p=' + page;
        let response = fetch(url);

        if (response.ok) {
            let doc = response.html()
            let next = parseInt(page, 10) + 1;
            let el = doc.select("a.booksearch")
            let data = [];
            el.forEach(e => {
                let stv_story_link = e.select("a").first().attr("href");
                let bookid = stv_story_link.split("/")[4];
                data.push({
                    name: toCapitalize(e.select(".searchbooktitle").first().text()),
                    link: BASE_URL + '/book/' + bookid + '.htm',
                    cover: 'https://static.69shuba.com/files/article/image/' + bookid.slice(0, bookid.length - 3) + '/' + bookid + '/' + bookid + 's.jpg',
                    description: e.select(" div > span.searchtag").last().text(),
                    host: ""
                })
            });

            return Response.success(data, next.toString());
        }

        return Response.error('fetch ' + url + ' failed: status ' + response.status);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}