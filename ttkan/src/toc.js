load('libs.js');
load('config.js');

function execute(url) {
    try {
        //https://www.ttkan.co/api/nq/amp_novel_chapters?language=tw&novel_id=qiweishang-lvyeqianhe&__amp_source_origin=https%3A%2F%2Fwww.ttkan.co
        var bookid = getBookId(url);
        url = `${BASE_URL}/api/nq/amp_novel_chapters?language=tw&novel_id=${bookid}&__amp_source_origin=${decodeURIComponent(BASE_URL)}`
        var response = crawler.get(url);
        if (!response.ok) throw new Error(`Status ${response.status}`);
        
        var json = response.json();
        
        if (!json || !json.items.length) throw new Error(`Length = 0`);
        
        var data = [];
        json.items.forEach(function (e) {
            data.push({
                name: e.chapter_name.formatTocName(),
                url: `https://www.wa01.com/novel/pagea/${bookid}_${e.chapter_id}.html`,
                host: BASE_URL,
            });
        });

        return Response.success(data);
    } catch (error) {
        // return Response.error(`Url ${url} \nMessage: ${error.message}`);
        return Response.success([{
            name: `Url ${url} \nMessage: ${error.message}`,
            url: '',
            host: BASE_URL,
        }]);
    }
}