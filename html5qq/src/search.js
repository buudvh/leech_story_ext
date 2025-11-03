
function execute(key, page) {
    var url = "https://so.html5.qq.com/ajax/real/search_result?tabId=360&noTab=1&q=" + key;
    try {
        let response = fetch(url);

        if (!response.ok) throw new Error("Status = " + response.status);

        let json = response.json();
        let book_list = json.data.state
        var data = [];
        const extractBookId = (url1) => (url1.match(/[?&]book(?:id|Id)=(\d+)/) || [])[1];

        book_list.forEach(e => {
            if (e.items && e.items.length > 0) {
                let e1 = e.items[0]
                data.push({
                    name: e1.title,
                    link: "https://bookshelf.html5.qq.com/autojump/intro?bookid=" + extractBookId(e1.jump_url),
                    cover: e1.cover_url,
                    description: '作者: ' + e1.author
                        + "\n" + (e1.abstract || ''),
                    host: "https://novel.html5.qq.com"
                })
            }
        });
        return Response.success(data);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}