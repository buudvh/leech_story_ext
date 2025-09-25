load('libs.js');
load('config.js');

function execute(url) {
    const match = url.match(/\/([A-Za-z0-9]+)\.html$/);
    let book_id = match[1];
    try {
        let response = fetch(BASE_URL + "/api/articleitems/" + book_id + ".json");
        if (response.ok) {
            let json = response.json();
            let chapterList = json.items;
            let data = [];

            if (!chapterList.length) return Response.error(url + "  Empty");

            for (let i = 0; i < chapterList.length; i++) {
                data.push({
                    name: formatName(TongWen.toSimplified(chapterList[i].chaptername || chapterList[i].cn || '未命名章节')),
                    url: BASE_URL + '/article/' + (chapterList[i].chapterid || chapterList[i].cid) + '.html',
                    host: BASE_URL,
                    id: (chapterList[i].chapterid || chapterList[i].cid)
                });
            }

            data = data.reverse();

            return Response.success(data);
        }

        return Response.error("Status: " + response.status + " " + url);
    } catch (error) {
        return Response.error(error.message);
    }
}

// function formatName(name) {
//     var re = /^(\d+)\.第(\d+)章\s*/;
//     let result = name.replace(re, '第$2章 ');

//     let lastParenIndex = Math.max(result.lastIndexOf('('), result.lastIndexOf('（'));

//     if (lastParenIndex !== -1) {
//         result = result.slice(0, lastParenIndex);
//     }

//     return result.trim();
// }