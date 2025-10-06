load('libs.js');
load('config.js');
load('gbk.js');
load('common.js');
load('1qidian.js')

function execute(url) {
    try {
        if (!url.includes("sangtac") && !url.includes("14.225.254.182")) {
            url = STVHOST + "/truyen/qidian/1/" + url.match(/\d+/g)[0];
        }
        var data = getDetailQidian(url);

        return Response.success(data);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}