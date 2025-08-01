load('config.js');
load('libs.js');
function execute(bookid, next) {
    if (!next) next = "0"
    try {
        let response = fetch("http://14.225.254.182/io/comment/webComments", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "start": next,
                "objectid": bookid,
                "objecttype": "69shu"
            })
        });
        if (response.ok) {
            let doc = response.html();
            let comments = [];
            let listCmtElm = doc.select('div.flex')

            if (listCmtElm.length == 0) {
                return Response.success(comments, null);
            }

            listCmtElm.forEach(function (elm) {
                comments.push({
                    name: elm.select('div.sec-bot a').text(),
                    content: cleanHtml(elm.select('div.sec-top').html()),
                });
            });

            var nextpage = doc.select('#cmtwd').attr('data-start');
            if (nextpage != next) {
                return Response.success(comments, nextpage + "");
            }

            return Response.success(comments, null);
        }

        return Response.success([{
            name: "LOG BUG",
            content: "bookid: " + bookid + " next: " + next + "  status: " + response.status,
        }], null);
    } catch (ex) {
        return Response.success([{
            name: "LOG BUG",
            content: "bookid: " + bookid + " next: " + next + "  exception: " + ex.message,
        }], null);
    }
}