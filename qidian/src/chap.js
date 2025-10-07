load('config.js');
load('libs.js');

function execute(url) {
    try {
        var data = getChapQidian(url);
        return Response.success(data);
    } catch (error) {
        return Response.error('fetch ' + url + ' failed: ' + error.message);
    }
}

function getChapQidian(url) {
    var response = fetch(url, {
        headers: {
            'user-agent': UserAgent.android(), // set chế độ điện thoại
        }
    });
    var doc = response.html();
    console.log(doc)
    var htm =  doc.select('.content').html();
    // var author_say = doc.select('.author-say p').first().html();
    // if(author_say){
    //     htm = htm +"<br><br>PS:<br><br>"+  author_say;
    // }
    return htm.replace(/<br\s*\/?>|\n/g, "<br><br>");
}