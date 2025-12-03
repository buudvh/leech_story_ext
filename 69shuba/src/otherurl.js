load('libs.js');
load('config.js');

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