load('libs.js');
load('config.js');

function execute(raw) {
    return Response.success(JSON.parse(raw));
}