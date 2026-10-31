load('common.js');

function execute(input, next) {
    if (!next) next = "0";
    var url = stvBase() + "/io/comment/webComments";
    try {
        var objData = JSON.parse(input);
        var params = encodeFormData({
            start: next,
            objectid: objData.bookid,
            objecttype: objData.host
        });
        var response = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });
        if (!response.ok) {
            return Response.error('Url: ' + url + '\nStatus: ' + response.status);
        }

        var doc = response.html();
        var comments = [];
        var listCmtElm = doc.select('div.flex');

        if (listCmtElm.length == 0) {
            return Response.success(comments, null);
        }

        listCmtElm.forEach(function (elm) {
            comments.push({
                name: elm.select('div.sec-bot a').text(),
                content: elm.select('div.sec-top').html(),
            });
        });

        var nextpage = doc.select('#cmtwd').attr('data-start');
        if (nextpage && nextpage != next) {
            return Response.success(comments, nextpage + "");
        }

        return Response.success(comments, null);
    } catch (ex) {
        return Response.error('Url: ' + url + '\nMessage: ' + ex.message);
    }
}

function encodeFormData(data) {
    var pairs = [];
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            pairs.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
        }
    }
    return pairs.join("&");
}
