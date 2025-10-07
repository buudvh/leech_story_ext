load('libs.js');
load('config.js');

function execute(url) {
    var isSTV = url.indexOf("sangtacviet") !== -1 || url.indexOf("14.225.254.182") !== -1;
    var nameSource = isSTV ? "STV" : "69shuba";
    return Response.success([
        {
            name: "Link " + nameSource,
            link: url,
            cover: DEFAULT_COVER,
            description: "Click vào đây để mở truyện với source " + nameSource,
        },
        {
            name: "Extension",
            link: "https://buudvh.github.io/extension.github.io/",
            cover: DEFAULT_COVER,
            description: "Link danh sách extension",
        },
        {
            name: "Vietpharse Tools",
            link: "https://buudvh.github.io/toolvp.github.io/",
            cover: DEFAULT_COVER,
            description: "Công cụ xử lý file vietpharse",
        },
    ]);
}