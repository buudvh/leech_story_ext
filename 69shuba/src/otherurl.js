load('libs.js');

function execute(data) {
    var bookinfo = JSON.parse(data);
    return Response.success([
        {
            name: bookinfo.name,
            link: bookinfo.url,
            cover: bookinfo.cover,
            description: "【" + bookinfo.source + "】"
        },
    ]);
}