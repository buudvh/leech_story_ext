load('libs.js');
load('config.js');
load('common.js');
load('1qidian.js')

function execute(url) {
    try {
        if(url.includes("qidian")){
            url = STVHOST + "/truyen/qidian/1/" + url.match(/\d+/g)[0] + "/";
        }
         
        var data = getTocQidian(url);

        return Response.success(data);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}
