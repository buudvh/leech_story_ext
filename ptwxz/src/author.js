load('libs.js');
load('config.js');

function execute(raw, page) {
    return Response.success(JSON.parse(raw));
}