load('libs.js');
load('config.js');

function execute(tag, page) {
    var url = '';
    try {
        let arrTag = tag.split("&");
        if (!page) page = '1';
        let sort = 'update';
        if (arrTag.length == 2) {
            sort = arrTag[1];
        }
        // let url = `${STVHOST}/io/searchtp/searchBooks/?find=&tag=${arrTag[0]}&sort=${sort}&host=69shu&minc=0&p=${page}`;
        url = STVHOST + '/io/searchtp/searchBooks/?find=&tag=' + arrTag[0] + '&sort=' + sort + '&host=69shu&minc=0&p=' + page;
        let response = fetch(url);

        if (!response.ok) throw new Error(`Status = ${response.status}`);

        let doc = response.html()
        let next = parseInt(page, 10) + 1;
        let el = doc.select("a.booksearch")
        let data = [];

        if (!el.length) throw new Error("Length = 0");

        el.forEach(e => {
            let stv_story_link = e.select("a").first().attr("href");
            let bookid = stv_story_link.split("/")[4];
            data.push({
                name: toCapitalize(e.select(".searchbooktitle").first().text()),
                link: STVHOST + "/truyen/69shu/1/" + bookid + "/",
                cover: buildCover(bookid),
                description: e.select("div > span.searchtag").first().text() + "|" + e.select("div > span.searchbookauthor").first().text()
                    + "\n" + e.select("div > span.lhr").last().text(),
            })
        });

        return Response.success(data, next.toString());
    } catch (error) {
        return Response.error(`Url: ${url} \nMessage: ${error.message}`);
    }
}