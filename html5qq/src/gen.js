function execute(url, page) {
    if (!page) page = 1;
    url = url.replace('{{page}}', page);
    let response = fetch("https://bookshelf.html5.qq.com/qbread/api/rank/list?ch=001995&" + url, {
        "headers": {
            "Referer": "https://bookshelf.html5.qq.com/qbread/categorylist?traceid=0809004&sceneid=FeedsTab&strageid=&ch=001995&tabfrom=top&feeds_version=8516&reader_version=0&groupid=1501&tag_type_id=1"
        }
    });
    if (response.ok) {
        let doc = response.json();
        let rows = doc.rows;
        const data = [];
        if (rows.length > 0) {
            rows.forEach(e => {
                data.push({
                    name: e.resourceName,
                    link: "https://bookshelf.html5.qq.com/autojump/intro?bookid=" + e.resourceID,
                    cover: e.picurl,
                    description: '作者: ' + e.author
                        + "\n" + e.summary,
                    host: "https://bookshelf.html5.qq.com"
                })
            });
            let next = parseInt(page, 10) + 1;
            return Response.success(data, next);
        } else {
            return Response.success(data);
        }
    }
    return null;
}

function formatDateTime(date) {
    var year = date.getFullYear();
    // getMonth() returns 0-11, so add 1 for actual month
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours(); // 0-23 (24-hour clock)
    var minute = date.getMinutes();
    var second = date.getSeconds();

    // Helper function to ensure two digits by padding with a leading zero
    function pad(n) {
        return n < 10 ? '0' + n : n;
    }

    return year + '-' + pad(month) + '-' + pad(day) + ' ' +
        pad(hour) + ':' + pad(minute) + ':' + pad(second);
}