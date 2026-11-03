load('common.js');

// Bình luận STV (`io/comment/webComments`, 10 bình luận gốc mỗi trang). Trả lời nằm ngay sau bình luận cha trong
// cùng trang: dòng có `reply('<id cha>')` khác `cmtid` của chính nó ⇒ gắn vào `replies` của bình luận cha.
var STV_MONTHS = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };

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
        var comments = parseComments(doc);
        if (comments.length == 0) {
            return Response.success(comments, null);
        }

        var nextpage = doc.select('#cmtwd').attr('data-start');
        if (nextpage && nextpage != next) {
            return Response.success(comments, nextpage + "");
        }

        return Response.success(comments, null);
    } catch (ex) {
        return Response.error('Url: ' + url + '\nMessage: ' + ex.message);
    }
}

function parseComments(doc) {
    var comments = [];
    var byId = {};
    doc.select('div.flex').forEach(function (elm) {
        var item = {
            name: elm.select('div.sec-bot a').text(),
            avatar: elm.select('img.comment-avatar').attr('src'),
            content: elm.select('div.sec-top').html(),
            description: joinParts([
                elm.select('div.sec-bot span.t-gray:not(.timeelap)').text(),
                formatTime(elm.select('div.sec-bot span.timeelap').text())
            ])
        };
        var id = elm.select('div[cmtid]').attr('cmtid');
        var match = /reply\('(\d+)'/.exec(elm.select('div.sec-bot span[onclick]').attr('onclick') || "");
        var parentId = match ? match[1] : "";
        if (parentId && parentId != id && byId[parentId]) {
            byId[parentId].replies.push(item);
            return;
        }
        // Không thấy bình luận cha trong trang ⇒ giữ như bình luận gốc.
        item.replies = [];
        if (id) byId[id] = item;
        comments.push(item);
    });
    return comments;
}

// "Thu Mar 26 2026 22:18:58 GMT+0700 (Indochina Time)" -> "26/03/2026 22:18"; dạng lạ thì bỏ phần "(...)".
function formatTime(text) {
    text = (text || "").trim();
    var m = /^\w{3} (\w{3}) (\d{1,2}) (\d{4}) (\d{2}):(\d{2})/.exec(text);
    if (!m || !STV_MONTHS[m[1]]) return text.replace(/\s*\(.*\)\s*$/, "");
    return (m[2].length < 2 ? "0" + m[2] : m[2]) + "/" + STV_MONTHS[m[1]] + "/" + m[3] + " " + m[4] + ":" + m[5];
}

function joinParts(parts) {
    var out = [];
    for (var i = 0; i < parts.length; i++) {
        var part = (parts[i] || "").replace(/\s+/g, " ").trim();
        if (part) out.push(part);
    }
    return out.join(" · ");
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
