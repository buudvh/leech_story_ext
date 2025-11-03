function execute(bookid, next) {
    var url = "https://novel.html5.qq.com/portal/novel-intro?bookid=" + bookid;
    try {
        let response = fetch(url);

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
        }], null);
    }
}