load('config.js');
load('libs.js');

function execute(key, next) {
    var url;
    try {
        var bookid = getBookId(key);
        if (!bookid) return Response.success([
            {
                name: "信息",
                content: "No comments!",
            }
        ]);

        url = "https://novel.html5.qq.com/portal/novel-intro?bookid=" + bookid;
        let response = crawler.get(url);

        if (!response.ok) throw new Error(`Status ${response.status}`);

        let doc = response.html();
        let comments = [];
        let listCmtElm = doc.select('._comment-item_95r2v_72');

        if (!listCmtElm.length) throw new Error(`No comments!`);

        listCmtElm.forEach(function (elm) {
            comments.push({
                name: elm.select('._user-name_95r2v_98').first().text() || "anonymous",
                content: elm.select('._comment-desc_95r2v_104').first().text(),
            });
        });

        return Response.success(comments);
    } catch (ex) {
        // return Response.error('fetch ' + url + ' failed: ' + ex.message);
        return Response.success([{
            name: "信息",
            content: ex.message,
        }]);
    }
}

function getBookId(key) {
    var url = "https://so.html5.qq.com/ajax/real/search_result?tabId=360&noTab=1&q=" + key;
    try {
        let response = crawler.get(url);

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
                    bookid: extractBookId(e1.jump_url),
                })
            }
        });

        data = data.find(p => p.name == key);

        return data ? data.bookid : null;
    } catch (error) {
        return null;
    }
}