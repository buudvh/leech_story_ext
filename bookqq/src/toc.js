function execute(url) {
    let bid = url.match(/\d+/)[0];
    let response = fetch('https://book.qq.com/book-chapter/' + bid);
    if (response.ok) {
        let doc = response.html();
        let novelList = [];
        doc.select(".list-a").forEach(e => {
            novelList.push({
                name: e.select("span").text(),
                url: "https:" + e.attr("href"),
                host: ""
            });
        });

        novelList = novelList.reverse();
        novelList = novelList.slice(-novelList.length / 2);

        return Response.success(novelList);
    }
    return null;
}