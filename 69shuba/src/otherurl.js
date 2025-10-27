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
        // {
        //     name: "Extension",
        //     link: "https://buudvh.github.io/extension.github.io/",
        //     cover: DEFAULT_COVER,
        //     description: "Link danh sách extension",
        // },
        // {
        //     name: "Vietpharse Tools",
        //     link: "https://buudvh.github.io/toolvp.github.io/",
        //     cover: DEFAULT_COVER,
        //     description: "Công cụ xử lý file vietpharse",
        // },
    ]);
}