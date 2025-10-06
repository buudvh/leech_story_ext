load('config.js');
load('libs.js');
load('1qidian.js')

function execute(url) {
    try {
        var data = getChapQidian(url);
        return Response.success(data);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}
