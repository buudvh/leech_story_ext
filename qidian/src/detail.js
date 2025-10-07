load('libs.js');
load('config.js');

//Get infor from stv
function execute(url) {
    try {
        if (!url.includes("sangtac") && !url.includes("14.225.254.182")) {
            url = STVHOST + "/truyen/qidian/1/" + url.match(/\/book\/(\d+)(?:\/|$)/)[1] + "/";
        }
        var idBook = getBookId(url);
        let response = fetch(url + '/');
        let doc = response.html();
        var author = doc.select("i.cap").attr("onclick").replace(/location=\'\/\?find\=&findinname\=(.*?)\'/g, "$1");
        let des = doc.select(".blk:has(.fa-water) .blk-body").html();

        var cover = doc.select('meta[property="og:image"]').first().attr("content").replace("/cdn/images/nc.jpg", "https://static.sangtacvietcdn.xyz/img/bookcover256.jpg")

        var comments = [{
            title: "评论",
            input: idBook,
            script: "comment.js"
        }];

        let data = {
            name: doc.select("#oriname").text(),
            cover: cover,
            author: author || 'Unknow',
            description: des,
            detail: "BookId: " + idBook,
            ongoing: true,
            host: STVHOST,
            comments: comments,
        }

        return Response.success(data);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}